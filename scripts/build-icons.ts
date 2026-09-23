import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const VARIANTS = ["linear", "bold"] as const;
type Variant = (typeof VARIANTS)[number];

type IconNode = [tag: string, attrs: Record<string, string>][];
type IconMeta = Record<string, { tags?: string[] }>;
type IconSource = { name: string; category: string; variants: Variant[] };
type IconIndexEntry = {
	name: string;
	export: string;
	category: string;
	variants: Variant[];
	tags: string[];
};

const root = join(import.meta.dirname, "..");
const iconsDir = join(root, "icons");
const outDir = join(root, "packages/react/src/icons");
const catalogPath = join(root, "packages/react/src/catalog.ts");
const categoriesPath = join(root, "packages/react/src/categories.ts");
const registryPath = join(root, "packages/react/src/registry.ts");
const metaPath = join(iconsDir, "meta.json");
const iconIndexPath = join(root, "packages/react/icons.json");

const STRIP_ATTRS = new Set(["xmlns", "class", "className"]);

function toPascalCase(name: string) {
	return name
		.split("-")
		.map((part) => {
			const first = part[0];
			if (!first) return "";
			return first.toUpperCase() + part.slice(1);
		})
		.join("");
}

function camelCaseAttr(name: string) {
	if (name.startsWith("data-") || name.startsWith("aria-")) return name;
	return name.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
}

function parseAttrs(raw: string) {
	const attrs: Record<string, string> = {};
	const re =
		/([:@A-Za-z_][\w:.-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
	for (const match of raw.matchAll(re)) {
		const rawName = match[1];
		if (!rawName) continue;
		const name = camelCaseAttr(rawName);
		if (STRIP_ATTRS.has(name)) continue;
		attrs[name] = match[2] ?? match[3] ?? match[4] ?? "";
	}
	return attrs;
}

function parseNodes(xml: string, file: string): IconNode {
	const nodes: IconNode = [];
	const src = xml.trim();
	let i = 0;

	while (i < src.length) {
		while (i < src.length && /\s/.test(src[i] ?? "")) i += 1;
		if (i >= src.length) break;
		if (src.startsWith("<!--", i)) {
			const end = src.indexOf("-->", i);
			i = end === -1 ? src.length : end + 3;
			continue;
		}
		if (src[i] !== "<") {
			i += 1;
			continue;
		}
		if (src.startsWith("</", i)) break;

		const tagMatch = src.slice(i).match(/^<([a-zA-Z][\w:-]*)/);
		if (!tagMatch?.[1]) break;
		const tag = tagMatch[1];
		const closeAngle = src.indexOf(">", i + tagMatch[0].length);
		if (closeAngle === -1) {
			throw new Error(`${file}: unclosed tag <${tag}>`);
		}
		const openTag = src.slice(i, closeAngle + 1);
		const selfClosing = openTag.endsWith("/>");
		const attrsRaw = src.slice(
			i + tagMatch[0].length,
			selfClosing ? closeAngle - 1 : closeAngle,
		);
		const attrs = parseAttrs(attrsRaw);

		if (selfClosing) {
			nodes.push([tag, attrs]);
			i = closeAngle + 1;
			continue;
		}

		const closeTag = `</${tag}>`;
		const closeAt = src.indexOf(closeTag, closeAngle + 1);
		if (closeAt === -1) {
			throw new Error(`${file}: missing ${closeTag}`);
		}
		const inner = src.slice(closeAngle + 1, closeAt).trim();
		if (inner.includes("<") && tag === "g") {
			const childNodes = parseNodes(inner, file);
			const transform = attrs.transform;
			for (const [childTag, childAttrs] of childNodes) {
				nodes.push([
					childTag,
					transform
						? {
								...childAttrs,
								transform: [transform, childAttrs.transform]
									.filter(Boolean)
									.join(" "),
							}
						: childAttrs,
				]);
			}
		} else if (!inner.includes("<")) {
			nodes.push([tag, inner ? { ...attrs, children: inner } : attrs]);
		} else {
			throw new Error(
				`${file}: <${tag}> with child elements is not supported. Only <g> containers are flattened.`,
			);
		}
		i = closeAt + closeTag.length;
	}

	return nodes;
}

function parseSvg(svg: string, file: string) {
	const open = svg.match(/<svg\b([^>]*)>/i);
	if (!open?.[1] || open.index === undefined) {
		throw new Error(`${file}: missing <svg>`);
	}
	const start = open.index + open[0].length;
	const end = svg.lastIndexOf("</svg>");
	if (end === -1) {
		throw new Error(`${file}: missing </svg>`);
	}
	const { viewBox, strokeWidth } = parseAttrs(open[1]);
	if (viewBox !== "0 0 24 24") {
		throw new Error(
			`${file}: viewBox must be "0 0 24 24", got ${JSON.stringify(viewBox)}`,
		);
	}
	// Root attributes are dropped and IconBase draws every stroke at 1.8, so any
	// other declared width only misleads people previewing the source file.
	if (strokeWidth !== undefined && strokeWidth !== "1.8") {
		throw new Error(
			`${file}: stroke-width must be "1.8", got ${JSON.stringify(strokeWidth)}`,
		);
	}
	const nodes = parseNodes(svg.slice(start, end), file);
	if (nodes.length === 0) {
		throw new Error(`${file}: no drawable nodes`);
	}
	return nodes;
}

function serializeAttrs(attrs: Record<string, string>) {
	const parts = Object.entries(attrs).map(([key, value]) => {
		const jsKey = /^[A-Za-z_][A-Za-z0-9_]*$/.test(key)
			? key
			: JSON.stringify(key);
		return `${jsKey}: ${JSON.stringify(value)}`;
	});
	return `{ ${parts.join(", ")} }`;
}

function serializeNodes(nodes: IconNode) {
	return `[\n${nodes
		.map(
			([tag, attrs]) =>
				`\t\t[${JSON.stringify(tag)}, ${serializeAttrs(attrs)}]`,
		)
		.join(",\n")},\n\t]`;
}

function listVariantDir(variant: Variant) {
	return readdir(join(iconsDir, variant), { withFileTypes: true });
}

async function listCategories() {
	const names = new Set<string>();
	for (const variant of VARIANTS) {
		const entries = await listVariantDir(variant);
		const loose = entries.filter(
			(entry) => entry.isFile() && entry.name.endsWith(".svg"),
		);
		if (loose.length > 0) {
			throw new Error(
				`put SVGs in a category folder, not ${variant}/ (${loose.map((entry) => entry.name).join(", ")})`,
			);
		}
		for (const entry of entries) {
			if (entry.isDirectory() && !entry.name.startsWith(".")) {
				names.add(entry.name);
			}
		}
	}
	return [...names].toSorted();
}

async function listIcons(): Promise<IconSource[]> {
	const seen = new Map<string, IconSource>();
	for (const variant of VARIANTS) {
		const entries = await listVariantDir(variant);
		for (const entry of entries) {
			if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
			const files = await readdir(join(iconsDir, variant, entry.name));
			for (const file of files) {
				if (!file.endsWith(".svg")) continue;
				const name = file.slice(0, -4);
				const existing = seen.get(name);
				if (!existing) {
					seen.set(name, { name, category: entry.name, variants: [variant] });
				} else if (existing.category === entry.name) {
					existing.variants.push(variant);
				} else {
					throw new Error(
						`Duplicate icon name "${name}" in ${existing.category} and ${entry.name}. Names must be unique across categories.`,
					);
				}
			}
		}
	}

	return [...seen.values()].toSorted((a, b) => a.name.localeCompare(b.name));
}

async function main() {
	const categories = await listCategories();
	const icons = await listIcons();
	if (icons.length === 0) {
		throw new Error(`No SVGs found under ${iconsDir}`);
	}

	const meta = JSON.parse(await readFile(metaPath, "utf8")) as IconMeta;
	const iconNames = new Set(icons.map((icon) => icon.name));
	const staleMeta = Object.keys(meta).filter((name) => !iconNames.has(name));
	if (staleMeta.length > 0) {
		throw new Error(
			`icons/meta.json has entries for icons that do not exist: ${staleMeta.join(", ")}`,
		);
	}
	const untagged = icons.filter((icon) => !meta[icon.name]?.tags?.length);
	if (untagged.length > 0) {
		console.warn(
			`Warning: ${untagged.length} icons have no tags in icons/meta.json: ${untagged.map((icon) => icon.name).join(", ")}`,
		);
	}
	const exportNames = new Set([
		"Icon",
		"IconProps",
		"IconName",
		"IconVariantMap",
		"HoneyIcon",
		"HoneyIconProps",
		"IconNode",
		"IconNodeMap",
		"IconVariant",
		"IconCategory",
	]);
	for (const { name } of icons) {
		if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(name)) {
			throw new Error(`Invalid icon name "${name}"; use lowercase kebab-case`);
		}
		const exportName = toPascalCase(name);
		if (exportNames.has(exportName)) {
			throw new Error(`Duplicate icon export "${exportName}" for ${name}`);
		}
		exportNames.add(exportName);
	}
	await rm(outDir, { recursive: true, force: true });
	await mkdir(outDir, { recursive: true });

	const barrelExports: string[] = [];
	const catalogImports: string[] = [];
	const catalogEntries: string[] = [];
	const registryEntries: string[] = [];
	const variantEntries: string[] = [];
	const iconIndex: IconIndexEntry[] = [];

	for (const icon of icons) {
		const pascal = toPascalCase(icon.name);
		const nodeEntries: string[] = [];
		for (const variant of icon.variants) {
			const relative = `${variant}/${icon.category}/${icon.name}.svg`;
			const svg = await readFile(join(iconsDir, relative), "utf8");
			nodeEntries.push(
				`\t${variant}: ${serializeNodes(parseSvg(svg, relative))}`,
			);
		}

		const source = `/* Generated by scripts/build-icons.ts. Do not edit. */
import { createIcon } from "../create-icon.js";

export const ${pascal} = /* @__PURE__ */ createIcon(${JSON.stringify(pascal)}, {
${nodeEntries.join(",\n")},
});
`;
		await writeFile(join(outDir, `${icon.name}.ts`), source);
		barrelExports.push(`export { ${pascal} } from "./${icon.name}.js";`);
		catalogImports.push(`import { ${pascal} } from "./icons/${icon.name}.js";`);
		registryEntries.push(`\t${JSON.stringify(icon.name)}: ${pascal},`);
		variantEntries.push(
			`\t${JSON.stringify(icon.name)}: ${icon.variants
				.map((variant) => JSON.stringify(variant))
				.join(" | ")};`,
		);

		const tags = meta[icon.name]?.tags ?? [];
		const { variants } = icon;
		catalogEntries.push(
			`	{
		name: ${JSON.stringify(icon.name)},
		pascalName: ${JSON.stringify(pascal)},
		category: ${JSON.stringify(icon.category)},
		tags: ${JSON.stringify(tags)},
		variants: ${JSON.stringify(variants)},
		component: ${pascal},
	}`,
		);
		iconIndex.push({
			name: icon.name,
			export: pascal,
			category: icon.category,
			variants,
			tags,
		});
	}

	const barrel = `/* Generated by scripts/build-icons.ts. Do not edit. */
${barrelExports.join("\n")}
`;

	const catalogImportsBlock = `\n${catalogImports.join("\n")}`;

	const categoriesSource = `/* Generated by scripts/build-icons.ts. Do not edit. */
export const ICON_CATEGORIES = [
${categories.map((item) => `\t${JSON.stringify(item)},`).join("\n")}
] as const;

export type IconCategory = (typeof ICON_CATEGORIES)[number];
`;

	const catalog = `/* Generated by scripts/build-icons.ts. Do not edit. */
import type { HoneyIcon } from "./create-icon.js";
import type { IconCategory } from "./categories.js";
import type { IconVariant } from "./types.js";${catalogImportsBlock}

export type { IconCategory } from "./categories.js";
export { ICON_CATEGORIES } from "./categories.js";

export type CatalogItem = {
	name: string;
	pascalName: string;
	category: IconCategory;
	tags: string[];
	variants: IconVariant[];
	component: HoneyIcon;
};

export const catalog: CatalogItem[] = [
${catalogEntries.join(",\n")},
];
`;

	const registry = `/* Generated by scripts/build-icons.ts. Do not edit. */
import type { HoneyIcon } from "./create-icon.js";${catalogImportsBlock}

export const icons = {
${registryEntries.join("\n")}
} satisfies Record<string, HoneyIcon>;

export type IconName = keyof typeof icons;

export type IconVariantMap = {
${variantEntries.join("\n")}
};
`;

	await writeFile(join(outDir, "index.ts"), barrel);
	await writeFile(registryPath, registry);
	await writeFile(categoriesPath, categoriesSource);
	await writeFile(catalogPath, catalog);
	await writeFile(iconIndexPath, `${JSON.stringify(iconIndex, null, "\t")}\n`);
	console.log(
		`Generated ${icons.length} icons across ${categories.length} categories`,
	);
}

await main();

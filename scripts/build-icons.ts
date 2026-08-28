import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const VARIANTS = ["linear", "bold", "duotone"] as const;
type Variant = (typeof VARIANTS)[number];

type IconNode = [tag: string, attrs: Record<string, string>][];
type IconMeta = Record<string, { tags?: string[] }>;
type IconSource = { name: string; category: string };

const root = join(import.meta.dir, "..");
const iconsDir = join(root, "icons");
const outDir = join(root, "packages/react/src/icons");
const catalogPath = join(root, "packages/react/src/catalog.ts");
const categoriesPath = join(root, "packages/react/src/categories.ts");
const metaPath = join(iconsDir, "meta.json");

const STRIP_ATTRS = new Set([
	"xmlns",
	"strokeWidth",
	"strokeLinecap",
	"strokeLinejoin",
	"class",
	"className",
]);

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

function parseNodes(xml: string): IconNode {
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
			throw new Error(`Unclosed tag <${tag}>`);
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
			throw new Error(`Missing ${closeTag}`);
		}
		const inner = src.slice(closeAngle + 1, closeAt).trim();
		if (inner.includes("<") && tag === "g") {
			const childNodes = parseNodes(inner);
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
			nodes.push([tag, attrs]);
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
	const rootAttrs = parseAttrs(open[1]);
	const viewBox = rootAttrs.viewBox ?? "0 0 24 24";
	if (viewBox !== "0 0 24 24") {
		throw new Error(`${file}: viewBox must be "0 0 24 24", got "${viewBox}"`);
	}
	const nodes = parseNodes(svg.slice(start, end));
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

function iconKey(icon: IconSource) {
	return `${icon.category}/${icon.name}`;
}

async function listCategories(variant: Variant) {
	const dir = join(iconsDir, variant);
	const entries = await readdir(dir, { withFileTypes: true });
	return entries
		.filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
		.map((entry) => entry.name)
		.sort();
}

async function listIcons(variant: Variant): Promise<IconSource[]> {
	const dir = join(iconsDir, variant);
	const entries = await readdir(dir, { withFileTypes: true });
	const loose = entries.filter(
		(entry) => entry.isFile() && entry.name.endsWith(".svg"),
	);
	if (loose.length > 0) {
		throw new Error(
			`${variant}: put SVGs in a category folder, not the style root (${loose.map((entry) => entry.name).join(", ")})`,
		);
	}

	const icons: IconSource[] = [];
	for (const entry of entries) {
		if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
		const files = await readdir(join(dir, entry.name));
		for (const file of files) {
			if (!file.endsWith(".svg")) continue;
			icons.push({ category: entry.name, name: file.slice(0, -4) });
		}
	}

	return icons.sort(
		(a, b) =>
			a.name.localeCompare(b.name) || a.category.localeCompare(b.category),
	);
}

function assertSame(label: string, expected: string[], actual: string[]) {
	const missing = expected.filter((item) => !actual.includes(item));
	const extra = actual.filter((item) => !expected.includes(item));
	if (missing.length > 0 || extra.length > 0) {
		throw new Error(
			`${label} is out of sync with linear.\nmissing: ${missing.join(", ") || "—"}\nextra: ${extra.join(", ") || "—"}`,
		);
	}
}

async function main() {
	const categoriesByVariant = {
		linear: await listCategories("linear"),
		bold: await listCategories("bold"),
		duotone: await listCategories("duotone"),
	};
	const categories = categoriesByVariant.linear;
	assertSame("bold categories", categories, categoriesByVariant.bold);
	assertSame("duotone categories", categories, categoriesByVariant.duotone);

	const iconsByVariant = {
		linear: await listIcons("linear"),
		bold: await listIcons("bold"),
		duotone: await listIcons("duotone"),
	};
	const icons = iconsByVariant.linear;
	assertSame(
		"bold icons",
		icons.map(iconKey),
		iconsByVariant.bold.map(iconKey),
	);
	assertSame(
		"duotone icons",
		icons.map(iconKey),
		iconsByVariant.duotone.map(iconKey),
	);

	const seen = new Map<string, string>();
	for (const icon of icons) {
		const existing = seen.get(icon.name);
		if (existing) {
			throw new Error(
				`Duplicate icon name "${icon.name}" in ${existing} and ${icon.category}. Names must be unique across categories.`,
			);
		}
		seen.set(icon.name, icon.category);
	}

	const meta = JSON.parse(await readFile(metaPath, "utf8")) as IconMeta;

	await rm(outDir, { recursive: true, force: true });
	await mkdir(outDir, { recursive: true });

	const barrelExports: string[] = [];
	const catalogImports: string[] = [];
	const catalogEntries: string[] = [];

	for (const icon of icons) {
		const pascal = toPascalCase(icon.name);
		const nodes: Record<Variant, IconNode> = {
			linear: [],
			bold: [],
			duotone: [],
		};
		for (const variant of VARIANTS) {
			const relative = `${icon.category}/${icon.name}.svg`;
			const file = join(iconsDir, variant, relative);
			const svg = await readFile(file, "utf8");
			nodes[variant] = parseSvg(svg, `${variant}/${relative}`);
		}

		const source = `/* Generated by scripts/build-icons.ts. Do not edit. */
import { createIcon } from "../create-icon";

export const ${pascal} = createIcon(${JSON.stringify(pascal)}, {
	linear: ${serializeNodes(nodes.linear)},
	bold: ${serializeNodes(nodes.bold)},
	duotone: ${serializeNodes(nodes.duotone)},
});
`;
		await writeFile(join(outDir, `${icon.name}.ts`), source);
		barrelExports.push(`export { ${pascal} } from "./${icon.name}";`);
		catalogImports.push(`import { ${pascal} } from "./icons/${icon.name}";`);

		catalogEntries.push(
			`	{
		name: ${JSON.stringify(icon.name)},
		pascalName: ${JSON.stringify(pascal)},
		category: ${JSON.stringify(icon.category)},
		tags: ${JSON.stringify(meta[icon.name]?.tags ?? [])},
		component: ${pascal},
	}`,
		);
	}

	const barrel = `/* Generated by scripts/build-icons.ts. Do not edit. */
${barrelExports.length > 0 ? `${barrelExports.join("\n")}\n` : "export {};\n"}`;

	const catalogImportsBlock =
		catalogImports.length > 0 ? `\n${catalogImports.join("\n")}` : "";
	const catalogArray =
		catalogEntries.length > 0 ? `[\n${catalogEntries.join(",\n")},\n]` : "[]";
	const categoriesLiteral =
		categories.length > 0
			? `\n${categories.map((item) => `\t${JSON.stringify(item)},`).join("\n")}\n`
			: "";

	const categoriesSource = `/* Generated by scripts/build-icons.ts. Do not edit. */
export const ICON_CATEGORIES = [${categoriesLiteral}] as const;

export type IconCategory = (typeof ICON_CATEGORIES)[number];
`;

	const catalog = `/* Generated by scripts/build-icons.ts. Do not edit. */
import type { HoneyIcon } from "./create-icon";
import type { IconCategory } from "./categories";${catalogImportsBlock}

export type { IconCategory } from "./categories";
export { ICON_CATEGORIES } from "./categories";

export type CatalogItem = {
	name: string;
	pascalName: string;
	category: IconCategory;
	tags: string[];
	component: HoneyIcon;
};

export const catalog: CatalogItem[] = ${catalogArray};
`;

	await writeFile(join(outDir, "index.ts"), barrel);
	await writeFile(categoriesPath, categoriesSource);
	await writeFile(catalogPath, catalog);
	console.log(
		`Generated ${icons.length} icons × ${VARIANTS.length} variants across ${categories.length} categories`,
	);
}

await main();

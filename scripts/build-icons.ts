import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const VARIANTS = ["linear", "bold", "duotone"] as const;
type Variant = (typeof VARIANTS)[number];

type IconNode = [tag: string, attrs: Record<string, string>][];
type IconMeta = Record<string, { tags?: string[]; aliases?: string[] }>;
type IconSource = { name: string; category: string };

const root = join(import.meta.dir, "..");
const iconsDir = join(root, "icons");
const outDir = join(root, "packages/react/src/icons");
const catalogPath = join(root, "packages/react/src/catalog.ts");
const categoriesPath = join(root, "packages/react/src/categories.ts");
const metaPath = join(iconsDir, "meta.json");

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
	const rootAttrs = parseAttrs(open[1]);
	const viewBox = rootAttrs.viewBox ?? "0 0 24 24";
	if (viewBox !== "0 0 24 24") {
		throw new Error(`${file}: viewBox must be "0 0 24 24", got "${viewBox}"`);
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

async function listVariantDir(variant: Variant) {
	const dir = join(iconsDir, variant);
	try {
		return await readdir(dir, { withFileTypes: true });
	} catch (error) {
		if (error instanceof Error && "code" in error && error.code === "ENOENT") {
			return [];
		}
		throw error;
	}
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
	const seen = new Map<string, string>();
	for (const variant of VARIANTS) {
		const entries = await listVariantDir(variant);
		for (const entry of entries) {
			if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
			const files = await readdir(join(iconsDir, variant, entry.name));
			for (const file of files) {
				if (!file.endsWith(".svg")) continue;
				const name = file.slice(0, -4);
				const existing = seen.get(name);
				if (existing && existing !== entry.name) {
					throw new Error(
						`Duplicate icon name "${name}" in ${existing} and ${entry.name}. Names must be unique across categories.`,
					);
				}
				seen.set(name, entry.name);
			}
		}
	}

	return [...seen.entries()]
		.map(([name, category]) => ({ name, category }))
		.toSorted(
			(a, b) =>
				a.name.localeCompare(b.name) || a.category.localeCompare(b.category),
		);
}

async function main() {
	const categories = await listCategories();
	const icons = await listIcons();

	const meta = JSON.parse(await readFile(metaPath, "utf8")) as IconMeta;
	const exportNames = new Set(icons.map((icon) => toPascalCase(icon.name)));
	for (const icon of icons) {
		for (const alias of meta[icon.name]?.aliases ?? []) {
			const aliasPascal = toPascalCase(alias);
			if (exportNames.has(aliasPascal)) {
				throw new Error(
					`Duplicate icon export "${aliasPascal}" for ${icon.name}`,
				);
			}
			exportNames.add(aliasPascal);
		}
	}

	await rm(outDir, { recursive: true, force: true });
	await mkdir(outDir, { recursive: true });

	const barrelExports: string[] = [];
	const catalogImports: string[] = [];
	const catalogEntries: string[] = [];

	for (const icon of icons) {
		const pascal = toPascalCase(icon.name);
		const aliases = meta[icon.name]?.aliases ?? [];
		const aliasExports = aliases.map((alias) => toPascalCase(alias));
		const aliasDeclarations = aliasExports
			.map(
				(alias) =>
					`/** @deprecated Use ${pascal} instead. */\nexport const ${alias} = ${pascal};\n`,
			)
			.join("\n");
		const relative = `${icon.category}/${icon.name}.svg`;
		const nodes: Partial<Record<Variant, IconNode>> = {};
		for (const variant of VARIANTS) {
			const file = join(iconsDir, variant, relative);
			try {
				const svg = await readFile(file, "utf8");
				nodes[variant] = parseSvg(svg, `${variant}/${relative}`);
			} catch (error) {
				if (
					error instanceof Error &&
					"code" in error &&
					error.code === "ENOENT"
				) {
					continue;
				}
				throw error;
			}
		}

		if (VARIANTS.every((variant) => !nodes[variant])) {
			throw new Error(`Missing SVG for ${relative}`);
		}

		const nodeEntries = VARIANTS.filter((variant) => nodes[variant]).map(
			(variant) => `\t${variant}: ${serializeNodes(nodes[variant] ?? [])}`,
		);

		const source = `/* Generated by scripts/build-icons.ts. Do not edit. */
import { createIcon } from "../create-icon.js";

export const ${pascal} = /* @__PURE__ */ createIcon(${JSON.stringify(pascal)}, {
${nodeEntries.join(",\n")},
});
${aliasDeclarations ? `\n${aliasDeclarations}` : ""}`;
		await writeFile(join(outDir, `${icon.name}.ts`), source);
		barrelExports.push(
			`export { ${[pascal, ...aliasExports].join(", ")} } from "./${icon.name}.js";`,
		);
		catalogImports.push(`import { ${pascal} } from "./icons/${icon.name}.js";`);

		catalogEntries.push(
			`	{
		name: ${JSON.stringify(icon.name)},
		pascalName: ${JSON.stringify(pascal)},
		category: ${JSON.stringify(icon.category)},
		tags: ${JSON.stringify([...new Set([...(meta[icon.name]?.tags ?? []), ...aliases])])},
		variants: ${JSON.stringify(VARIANTS.filter((item) => nodes[item]))},
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

export const catalog: CatalogItem[] = ${catalogArray};
`;

	await writeFile(join(outDir, "index.ts"), barrel);
	await writeFile(categoriesPath, categoriesSource);
	await writeFile(catalogPath, catalog);
	console.log(
		`Generated ${icons.length} icons across ${categories.length} categories`,
	);
}

await main();

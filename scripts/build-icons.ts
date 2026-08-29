import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const VARIANTS = ["linear", "bold", "duotone"] as const;
type Variant = (typeof VARIANTS)[number];
const REQUIRED_STYLE: Variant = "linear";

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

async function listCategories() {
	const dir = join(iconsDir, REQUIRED_STYLE);
	const entries = await readdir(dir, { withFileTypes: true });
	return entries
		.filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
		.map((entry) => entry.name)
		.sort();
}

async function listIcons(): Promise<IconSource[]> {
	const dir = join(iconsDir, REQUIRED_STYLE);
	const entries = await readdir(dir, { withFileTypes: true });
	const loose = entries.filter(
		(entry) => entry.isFile() && entry.name.endsWith(".svg"),
	);
	if (loose.length > 0) {
		throw new Error(
			`put SVGs in a category folder, not ${REQUIRED_STYLE}/ (${loose.map((entry) => entry.name).join(", ")})`,
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

async function main() {
	const categories = await listCategories();
	const icons = await listIcons();

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
		const relative = `${icon.category}/${icon.name}.svg`;
		const nodes: Partial<Record<Variant, IconNode>> = {};
		for (const variant of VARIANTS) {
			const file = join(iconsDir, variant, relative);
			try {
				const svg = await readFile(file, "utf8");
				nodes[variant] = parseSvg(svg, `${variant}/${relative}`);
			} catch (error) {
				if (
					variant !== REQUIRED_STYLE &&
					error instanceof Error &&
					"code" in error &&
					error.code === "ENOENT"
				) {
					continue;
				}
				throw error;
			}
		}

		const linear = nodes.linear;
		if (!linear) {
			throw new Error(`Missing ${REQUIRED_STYLE}/${relative}`);
		}

		const nodeEntries = VARIANTS.filter((variant) => nodes[variant]).map(
			(variant) => `\t${variant}: ${serializeNodes(nodes[variant] ?? [])}`,
		);

		const source = `/* Generated by scripts/build-icons.ts. Do not edit. */
import { createIcon } from "../create-icon";

export const ${pascal} = createIcon(${JSON.stringify(pascal)}, {
${nodeEntries.join(",\n")},
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
		`Generated ${icons.length} icons across ${categories.length} categories`,
	);
}

await main();

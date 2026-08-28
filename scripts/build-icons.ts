import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const VARIANTS = ["linear", "bold", "duotone"] as const;
type Variant = (typeof VARIANTS)[number];

type IconNode = [tag: string, attrs: Record<string, string>][];
type IconMeta = Record<
	string,
	{
		tags: string[];
		category: string;
	}
>;

const root = join(import.meta.dir, "..");
const iconsDir = join(root, "icons");
const outDir = join(root, "packages/react/src/icons");
const catalogPath = join(root, "packages/react/src/catalog.ts");
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

async function listSvgNames(variant: Variant) {
	const dir = join(iconsDir, variant);
	const files = await readdir(dir);
	return files
		.filter((file) => file.endsWith(".svg"))
		.map((file) => file.slice(0, -4))
		.sort();
}

async function main() {
	const namesByVariant = {
		linear: await listSvgNames("linear"),
		bold: await listSvgNames("bold"),
		duotone: await listSvgNames("duotone"),
	};

	const names = namesByVariant.linear;

	for (const variant of VARIANTS) {
		const current = namesByVariant[variant];
		const missing = names.filter((name) => !current.includes(name));
		const extra = current.filter((name) => !names.includes(name));
		if (missing.length > 0 || extra.length > 0) {
			throw new Error(
				`${variant} is out of sync with linear.\nmissing: ${missing.join(", ") || "—"}\nextra: ${extra.join(", ") || "—"}`,
			);
		}
	}

	const meta = JSON.parse(await readFile(metaPath, "utf8")) as IconMeta;
	const missingMeta = names.filter((name) => !meta[name]);
	if (missingMeta.length > 0) {
		throw new Error(`Missing meta for: ${missingMeta.join(", ")}`);
	}

	await rm(outDir, { recursive: true, force: true });
	await mkdir(outDir, { recursive: true });

	const barrelExports: string[] = [];
	const catalogImports: string[] = [];
	const catalogEntries: string[] = [];

	for (const name of names) {
		const pascal = toPascalCase(name);
		const nodes: Record<Variant, IconNode> = {
			linear: [],
			bold: [],
			duotone: [],
		};
		for (const variant of VARIANTS) {
			const file = join(iconsDir, variant, `${name}.svg`);
			const svg = await readFile(file, "utf8");
			nodes[variant] = parseSvg(svg, `${variant}/${name}.svg`);
		}

		const source = `/* Generated by scripts/build-icons.ts. Do not edit. */
import { createIcon } from "../create-icon";

export const ${pascal} = createIcon(${JSON.stringify(pascal)}, {
	linear: ${serializeNodes(nodes.linear)},
	bold: ${serializeNodes(nodes.bold)},
	duotone: ${serializeNodes(nodes.duotone)},
});
`;
		await writeFile(join(outDir, `${name}.ts`), source);
		barrelExports.push(`export { ${pascal} } from "./${name}";`);
		catalogImports.push(`import { ${pascal} } from "./icons/${name}";`);

		const entry = meta[name];
		if (!entry) {
			throw new Error(`Missing meta for ${name}`);
		}
		catalogEntries.push(
			`	{
		name: ${JSON.stringify(name)},
		pascalName: ${JSON.stringify(pascal)},
		category: ${JSON.stringify(entry.category)},
		tags: ${JSON.stringify(entry.tags)},
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

	const catalog = `/* Generated by scripts/build-icons.ts. Do not edit. */
import type { HoneyIcon } from "./create-icon";${catalogImportsBlock}

export type CatalogItem = {
	name: string;
	pascalName: string;
	category: string;
	tags: string[];
	component: HoneyIcon;
};

export const catalog: CatalogItem[] = ${catalogArray};
`;

	await writeFile(join(outDir, "index.ts"), barrel);
	await writeFile(catalogPath, catalog);
	console.log(`Generated ${names.length} icons × ${VARIANTS.length} variants`);
}

await main();

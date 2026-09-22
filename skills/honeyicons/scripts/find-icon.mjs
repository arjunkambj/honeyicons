#!/usr/bin/env node
// Search the live Honeyicons index. Requires Node 20+.
//
//   node find-icon.mjs <query> [<query> ...] [options]
//   node find-icon.mjs --list [--category <name>]
//
// Options:
//   --version <v>     Search a specific published version instead of npm latest.
//   --github[=ref]    Search unreleased icons on GitHub (default ref: main).
//   --installed       Search only the version installed in the current project.
//   --category <c>    Only show icons in this category.
//   --limit <n>       Matches per query (default 8).
//   --list            Print every icon (combine with --category).
//   --json            Print JSON instead of text.
//
// Each query can be a concept ("notification"), an icon name ("arrow-down"),
// a component name ("ArrowDown"), or a name from another library
// ("ArrowDown01Icon", "Trash2"). Lines marked "=" match a name or a tag, such
// as a source-library name, exactly.

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

const PACKAGE = "@honeyicons/react";
const REPO = "arjunkambj/honeyicons";

function parseArgs(argv) {
	const opts = { queries: [], limit: 8 };
	for (let i = 0; i < argv.length; i += 1) {
		const arg = argv[i];
		const next = () => {
			const value = argv[i + 1];
			if (value === undefined || value.startsWith("--")) {
				throw new Error(`${arg} needs a value`);
			}
			i += 1;
			return value;
		};
		if (arg === "--version") opts.version = next();
		else if (arg === "--github") opts.github = "main";
		else if (arg.startsWith("--github=")) opts.github = arg.slice(9) || "main";
		else if (arg === "--installed") opts.installed = true;
		else if (arg === "--category") opts.category = next().toLowerCase();
		else if (arg === "--limit") {
			opts.limit = Number(next());
			if (!Number.isInteger(opts.limit) || opts.limit < 1) {
				throw new Error("--limit needs a positive whole number");
			}
		} else if (arg === "--list") opts.list = true;
		else if (arg === "--json") opts.json = true;
		else if (arg === "--help" || arg === "-h") opts.help = true;
		else if (arg.startsWith("-")) throw new Error(`Unknown option: ${arg}`);
		else opts.queries.push(arg);
	}
	if ([opts.installed, opts.github, opts.version].filter(Boolean).length > 1) {
		throw new Error("Choose only one of --installed, --github, or --version");
	}
	return opts;
}

async function fetchText(url) {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`${response.status} ${response.statusText} for ${url}`);
	}
	return response.text();
}

function findInstalled(start) {
	let dir = start;
	while (true) {
		const pkgDir = join(dir, "node_modules", PACKAGE);
		const pkgJson = join(pkgDir, "package.json");
		if (existsSync(pkgJson)) {
			return {
				dir: pkgDir,
				version: JSON.parse(readFileSync(pkgJson, "utf8")).version,
			};
		}
		const parent = dirname(dir);
		if (parent === dir) return undefined;
		dir = parent;
	}
}

function loadInstalledIcons(installed) {
	const index = join(installed.dir, "icons.json");
	if (!existsSync(index)) {
		throw new Error(
			`${PACKAGE}@${installed.version} in ${installed.dir} has no icons.json. Upgrade ${PACKAGE}.`,
		);
	}
	return JSON.parse(readFileSync(index, "utf8"));
}

async function loadPublishedIcons(version) {
	return JSON.parse(
		await fetchText(
			`https://cdn.jsdelivr.net/npm/${PACKAGE}@${version}/icons.json`,
		),
	);
}

async function loadSource(opts, installed) {
	if (opts.installed) {
		if (!installed)
			throw new Error(
				`${PACKAGE} is not installed here (no node_modules/${PACKAGE} found in ${process.cwd()} or its parents)`,
			);
		return {
			label: `${PACKAGE}@${installed.version} (installed)`,
			icons: loadInstalledIcons(installed),
		};
	}
	if (opts.github) {
		const url = `https://raw.githubusercontent.com/${REPO}/${opts.github}/packages/react/icons.json`;
		return {
			label: `GitHub ${REPO}@${opts.github} (may include unpublished icons)`,
			icons: JSON.parse(await fetchText(url)),
		};
	}
	const version =
		opts.version ??
		JSON.parse(await fetchText(`https://registry.npmjs.org/${PACKAGE}/latest`))
			.version;
	return {
		label: `${PACKAGE}@${version}${opts.version ? "" : " (npm latest)"}`,
		icons: await loadPublishedIcons(version),
	};
}

function toKebab(value) {
	return value
		.trim()
		.replace(/([a-z])([A-Z0-9])/g, "$1-$2")
		.replace(/([0-9])([A-Za-z])/g, "$1-$2")
		.replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
		.replace(/[\s_]+/g, "-")
		.toLowerCase()
		.replace(/-icon$/, "");
}

function scoreIcon(icon, query) {
	const kebab = toKebab(query);
	const compact = kebab.replaceAll("-", "");
	const name = icon.name;
	const tags = icon.tags.map((tag) => tag.toLowerCase());

	if (name === kebab || name.replaceAll("-", "") === compact) return 100;
	if (tags.includes(kebab) || tags.includes(compact)) return 70;

	const words = kebab.split("-").filter((word) => word && !/^\d+$/.test(word));
	if (words.length === 0) return 0;
	const nameParts = name.split("-");
	let total = 0;
	let matched = 0;
	for (const word of words) {
		let points = 0;
		if (nameParts.includes(word)) points = 20;
		else if (tags.includes(word)) points = 12;
		else if (word.length >= 3 && name.includes(word)) points = 8;
		else if (word.length >= 3 && tags.some((tag) => tag.includes(word)))
			points = 4;
		if (points) matched += 1;
		total += points;
	}
	// Every word should match, but allow one miss in longer queries so
	// names from other libraries ("chevrons-up-down") still find candidates.
	if (matched < words.length - (words.length > 2 ? 1 : 0)) return 0;
	return Math.min(
		(total / words.length) * (matched / words.length) + matched,
		65,
	);
}

function describe(icon, installedNames) {
	// The kebab-case name leads because it is what <Icon icon="..." /> takes.
	const parts = [
		icon.name.padEnd(24),
		icon.export.padEnd(22),
		icon.category.padEnd(12),
		icon.variants.join("+").padEnd(12),
	];
	const tags = icon.tags
		.filter((tag) => !/^(solar|hugeicons)$/.test(tag))
		.slice(0, 6);
	const missing =
		installedNames && !installedNames.has(icon.name)
			? "  [NOT in installed version]"
			: "";
	return `${parts.join(" ")} ${tags.join(", ")}${missing}`;
}

async function main() {
	const opts = parseArgs(process.argv.slice(2));
	if (opts.help || (!opts.list && opts.queries.length === 0)) {
		console.log(
			readFileSync(new URL(import.meta.url), "utf8").split("\n\nimport")[0],
		);
		return;
	}

	const installed = findInstalled(process.cwd());
	const source = await loadSource(opts, installed);
	const installedNames =
		installed && !opts.installed
			? new Set(loadInstalledIcons(installed).map((icon) => icon.name))
			: undefined;

	const pool = opts.category
		? source.icons.filter((icon) => icon.category === opts.category)
		: source.icons;

	const header = [
		`${source.label}: ${source.icons.length} icons`,
		...(opts.installed
			? []
			: [installed ? `installed: ${installed.version}` : "not installed here"]),
	].join(" | ");

	if (opts.list) {
		if (opts.json) return console.log(JSON.stringify(pool, null, 2));
		console.log(header);
		for (const icon of pool) console.log(describe(icon, installedNames));
		return;
	}

	const results = opts.queries.map((query) => ({
		query,
		matches: pool
			.map((icon) => ({ icon, score: scoreIcon(icon, query) }))
			.filter((item) => item.score > 0)
			.toSorted(
				(a, b) => b.score - a.score || a.icon.name.localeCompare(b.icon.name),
			)
			.slice(0, opts.limit),
	}));

	if (opts.json) {
		return console.log(
			JSON.stringify(
				{
					source: source.label,
					installed: installed?.version ?? null,
					results: results.map(({ query, matches }) => ({
						query,
						matches: matches.map(({ icon, score }) => ({
							...icon,
							exact: score >= 70,
							inInstalled: installedNames
								? installedNames.has(icon.name)
								: null,
						})),
					})),
				},
				null,
				2,
			),
		);
	}

	console.log(header);
	for (const { query, matches } of results) {
		console.log(`\n"${query}"`);
		if (matches.length === 0) {
			console.log("  no match. Try a broader concept, or report the gap.");
			continue;
		}
		for (const { icon, score } of matches) {
			console.log(
				`  ${score >= 70 ? "=" : " "} ${describe(icon, installedNames)}`,
			);
		}
	}
}

main().catch((error) => {
	console.error(`find-icon: ${error.message}`);
	// fetch() rejects with a cause only when the network request itself fails.
	if (error.cause) {
		console.error(
			"Offline? Use --installed to search the installed package, or fetch https://cdn.jsdelivr.net/npm/@honeyicons/react@latest/icons.json directly.",
		);
	}
	process.exit(1);
});

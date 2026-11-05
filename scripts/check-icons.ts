import { readdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { doubleQuoted, fitDrawing } from "./icon-geometry.ts";

// Renders every icon the way IconBase ships it, measures the pixels, and fails on
// any problem that scripts/known-icon-issues.json doesn't already list.
// Run with --help for the commands.

const root = join(import.meta.dirname, "..");
const iconsDir = join(root, "icons");
const issuesPath = join(root, "scripts/known-icon-issues.json");

const VARIANTS = ["linear", "bold"] as const;
type Variant = (typeof VARIANTS)[number];

/** Pixels per icon unit while measuring. A unit is 1/24 of the icon box. */
const UNIT = 20;
const SIDE = 24 * UNIT;
const AREA = SIDE * SIDE;
/** Rendering rounds edges by up to this much, in units. */
const SLACK = 0.06;
/** A listed problem fails again once it grows by more than this. */
const WORSE_BY = 0.05;

const LIMIT = {
	edgeMin: 1.1,
	edgeMax: 22.9,
	longSide: 21.6,
	longSideSlack: 0.3,
	centreDrift: 0.4,
	gap: 1.8,
	slashGap: 1.5,
	channel: 1.5,
	crampedArea: 5,
	line: 1.8,
	crumbArea: 3,
	offPieces: 4,
	boxDrift: 0.2,
};

const RULES = {
	pair: {
		what: "Every icon exists in both linear and bold, in the same category.",
		fix: "Add the missing style. Bold comes from linear.",
	},
	blank: {
		what: "Every drawing shows something.",
		fix: 'Put stroke="currentColor" or fill="currentColor" on each node. The build drops attributes on the root <svg>.',
	},
	edges: {
		what: `Outer edges stay inside ${LIMIT.edgeMin} to ${LIMIT.edgeMax}.`,
		fix: "Scale the drawing down or move it in.",
	},
	size: {
		what: `The longest side is ${LIMIT.longSide}, give or take ${LIMIT.longSideSlack}, so neighbours match. Logos and marks with no body, like arrows and letters, are exempt. A new mark goes in MARK_NAMES in scripts/check-icons.ts.`,
		fix: "Run pnpm check:icons --fit <name>, then look at it. It rewrites the coordinates, so strokes stay 1.8. Bold scales as a whole, so derive it again if its gaps look wide.",
	},
	centre: {
		what: `The drawing's box is centred on 12, 12, within ${LIMIT.centreDrift}.`,
		fix: "Run pnpm check:icons --fit <name>, or move the whole drawing by the amount shown. Logos move as a group.",
	},
	spacing: {
		what: `Separate parts stay at least ${LIMIT.gap} apart, the width of the line. The slash in *-off icons needs ${LIMIT.slashGap}.`,
		fix: "Move the parts apart, shrink the inner part, or drop a detail.",
	},
	cramped: {
		what: `No more than ${LIMIT.crampedArea} square units of space sit in channels narrower than ${LIMIT.channel}. Those fill in at 16px.`,
		fix: "Open up the narrowest channel, or drop a detail.",
	},
	line: {
		what: `The main line is ${LIMIT.line} thick. Dots-only marks are exempt from the lower limit.`,
		fix: `Redraw it with strokes at ${LIMIT.line}. A pasted outline keeps its pack's weight.`,
	},
	crumbs: {
		what: `No separate piece is smaller than a dot of radius 1, about ${LIMIT.crumbArea} square units.`,
		fix: "Merge the piece into its neighbour or delete it.",
	},
	pieces: {
		what: `*-off icons break into at most ${LIMIT.offPieces} pieces.`,
		fix: "Delete leftovers the slash cut off. Keep what makes the object recognisable.",
	},
	box: {
		what: `Bold fills the same box as linear, within ${LIMIT.boxDrift}.`,
		fix: "Fix linear first if needed, then derive bold from it again.",
	},
} satisfies Record<string, { what: string; fix: string }>;

type RuleId = keyof typeof RULES;
const RULE_IDS = Object.keys(RULES) as RuleId[];

/** `amount` is how far past the limit it is, so bigger is always worse. */
type Finding = { rule: RuleId; amount: number; detail: string };
type Problem = Finding & { style: Variant | "both" };
type IconFile = { name: string; category: string; variant: Variant };
type Box = { left: number; right: number; top: number; bottom: number };
type KnownIssues = {
	/** Exceptions a person approved. These never fail and never show on the to-do list. */
	accepted: Record<string, Partial<Record<RuleId, string>>>;
	/** Problems measured in the existing set, and how far past the limit each was. */
	measured: Record<string, Partial<Record<RuleId, number>>>;
	/** Problems a person saw that pixels can't catch, with what to do about each. */
	flagged: Record<string, string>;
};

// Marks have no object body, so they look right smaller than a full-size icon.
const MARK_CATEGORIES = new Set(["arrows"]);
const MARK_NAMES =
	/^(add|close|minus|repeat-one|check|check-double|more-.+|menu|reorder|grip-.+|question-mark|percent|dollar|pause|play-mini|terminal|code|braces|variable|soundwave|waves|bold|italic|heading.*|type|text-.+|strikethrough|superscript|hashtag|slash|list|list-.+|indent|outdent|signal|volume-low|analytics|kanban|chart-line|sort-.+|flip-horizontal)$/;

const isMark = (icon: IconFile) =>
	MARK_CATEGORIES.has(icon.category) || MARK_NAMES.test(icon.name);
// Spinners are made of faint animated parts, so pixels say nothing useful.
const isSpinner = (name: string) => name.startsWith("spinner");
const round = (value: number, digits = 2) => Number(value.toFixed(digits));
const signed = (value: number) => `${value >= 0 ? "+" : ""}${round(value, 1)}`;
const at = (values: ArrayLike<number>, index: number) =>
	values[index] as number;

const SHAPE_NODE =
	/<(path|circle|rect|ellipse|line|polygon|polyline)\b([^>]*?)(\/?)>/g;

/** The drawing as IconBase renders it: root attributes replaced, filled nodes unstroked. */
function asShipped(source: string, file: string, color = "#000") {
	const quoted = doubleQuoted(source);
	const open = quoted.match(/<svg\b[^>]*>/i);
	if (!open || open.index === undefined) {
		throw new Error(`${file}: missing <svg>`);
	}
	const inner = quoted.slice(
		open.index + open[0].length,
		quoted.lastIndexOf("</svg>"),
	);
	const strokes = /\bstroke="(?!none")[^"]+"/.test(inner);
	const body = strokes
		? inner.replace(SHAPE_NODE, (node, tag, attrs, close) => {
				const fill = attrs.match(/\bfill="([^"]+)"/)?.[1];
				const hasStroke = /\bstroke="/.test(attrs);
				return fill && fill !== "none" && !hasStroke
					? `<${tag}${attrs} stroke="none"${close}>`
					: node;
			})
		: inner;
	const stroke = strokes
		? ` stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"`
		: "";
	const svg =
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"${stroke}>${body}</svg>`.replaceAll(
			"currentColor",
			color,
		);
	return { svg, strokes };
}

/** One byte per pixel: 1 where the icon has ink. */
function renderInk(svg: string) {
	const { pixels } = new Resvg(svg, {
		fitTo: { mode: "width", value: SIDE },
		font: { loadSystemFonts: false },
	}).render();
	const ink = new Uint8Array(AREA);
	for (let i = 0; i < AREA; i++) {
		ink[i] = at(pixels, i * 4 + 3) > 127 ? 1 : 0;
	}
	return ink;
}

/** Squared distance from every set pixel to the nearest unset pixel. */
function squaredDistances(mask: Uint8Array) {
	const FAR = 1e12;
	const dist = new Float64Array(AREA);
	for (let i = 0; i < AREA; i++) dist[i] = mask[i] ? FAR : 0;
	const line = new Float64Array(SIDE);
	const hull = new Int32Array(SIDE);
	const bounds = new Float64Array(SIDE + 1);
	const crossing = (a: number, b: number) =>
		(at(line, b) + b * b - (at(line, a) + a * a)) / (2 * b - 2 * a);
	const sweep = (start: number, step: number) => {
		for (let i = 0; i < SIDE; i++) line[i] = at(dist, start + i * step);
		let top = 0;
		hull[0] = 0;
		bounds[0] = -FAR;
		bounds[1] = FAR;
		for (let q = 1; q < SIDE; q++) {
			let s = crossing(at(hull, top), q);
			while (s <= at(bounds, top)) {
				top--;
				s = crossing(at(hull, top), q);
			}
			top++;
			hull[top] = q;
			bounds[top] = s;
			bounds[top + 1] = FAR;
		}
		top = 0;
		for (let q = 0; q < SIDE; q++) {
			while (at(bounds, top + 1) < q) top++;
			const nearest = at(hull, top);
			dist[start + q * step] =
				(q - nearest) * (q - nearest) + at(line, nearest);
		}
	};
	for (let x = 0; x < SIDE; x++) sweep(x, SIDE);
	for (let y = 0; y < SIDE; y++) sweep(y * SIDE, 1);
	return dist;
}

function findBox(ink: Uint8Array): Box | undefined {
	let left = SIDE;
	let right = -1;
	let top = SIDE;
	let bottom = -1;
	for (let y = 0; y < SIDE; y++) {
		for (let x = 0; x < SIDE; x++) {
			if (!ink[x + y * SIDE]) continue;
			if (x < left) left = x;
			if (x > right) right = x;
			if (y < top) top = y;
			if (y > bottom) bottom = y;
		}
	}
	if (right < 0) return undefined;
	return {
		left: left / UNIT,
		right: (right + 1) / UNIT,
		top: top / UNIT,
		bottom: (bottom + 1) / UNIT,
	};
}

/** Numbers each connected piece of ink from 1 and returns its pixel count. */
function labelPieces(ink: Uint8Array) {
	const labels = new Int32Array(AREA);
	const areas: number[] = [];
	const stack: number[] = [];
	for (let start = 0; start < AREA; start++) {
		if (!ink[start] || labels[start]) continue;
		const label = areas.length + 1;
		let area = 0;
		labels[start] = label;
		stack.push(start);
		while (stack.length > 0) {
			const pixel = stack.pop() as number;
			area++;
			const x = pixel % SIDE;
			const y = Math.floor(pixel / SIDE);
			for (let dy = -1; dy <= 1; dy++) {
				for (let dx = -1; dx <= 1; dx++) {
					const nx = x + dx;
					const ny = y + dy;
					if (nx < 0 || ny < 0 || nx >= SIDE || ny >= SIDE) continue;
					const next = nx + ny * SIDE;
					if (ink[next] && !labels[next]) {
						labels[next] = label;
						stack.push(next);
					}
				}
			}
		}
		areas.push(area);
	}
	return { labels, areas };
}

function smallestGap(labels: Int32Array, pieceCount: number) {
	let best = Number.POSITIVE_INFINITY;
	let closest = 0;
	for (let piece = 1; piece < pieceCount; piece++) {
		const distances = squaredDistances(
			Uint8Array.from(labels, (label) => (label === piece ? 0 : 1)),
		);
		for (let i = 0; i < AREA; i++) {
			if (at(labels, i) > piece && at(distances, i) < best) {
				best = at(distances, i);
				closest = i;
			}
		}
	}
	return {
		// Pixel centres sit one pixel further apart than the edges of the gap.
		gap: (Math.sqrt(best) - 1) / UNIT,
		x: (closest % SIDE) / UNIT,
		y: Math.floor(closest / SIDE) / UNIT,
	};
}

/** Square units of space inside channels narrower than the limit. */
function crampedArea(ink: Uint8Array) {
	const reach = (LIMIT.channel / 2) * UNIT;
	const fromInk = squaredDistances(ink.map((value) => (value ? 0 : 1)));
	const grown = new Uint8Array(AREA);
	for (let i = 0; i < AREA; i++) {
		grown[i] = at(fromInk, i) <= reach * reach ? 1 : 0;
	}
	const insideGrown = squaredDistances(grown);
	let cramped = 0;
	for (let i = 0; i < AREA; i++) {
		if (!ink[i] && grown[i] && at(insideGrown, i) > reach * reach) cramped++;
	}
	return cramped / (UNIT * UNIT);
}

/** The most common line width, read off the middle of every stroke. */
function mainLineWidth(ink: Uint8Array) {
	const fromEdge = squaredDistances(ink);
	const counts = new Map<number, number>();
	for (let y = 1; y < SIDE - 1; y++) {
		for (let x = 1; x < SIDE - 1; x++) {
			const i = x + y * SIDE;
			if (!ink[i]) continue;
			const value = at(fromEdge, i);
			const west = at(fromEdge, i - 1);
			const east = at(fromEdge, i + 1);
			const north = at(fromEdge, i - SIDE);
			const south = at(fromEdge, i + SIDE);
			const middle =
				(value >= west && value >= east && (west < value || east < value)) ||
				(value >= north && value >= south && (north < value || south < value));
			if (!middle) continue;
			const width = round((2 * Math.sqrt(value)) / UNIT, 1);
			if (width >= 0.6) counts.set(width, (counts.get(width) ?? 0) + 1);
		}
	}
	let best = 0;
	let bestCount = 0;
	for (const [width, count] of counts) {
		if (count > bestCount) {
			best = width;
			bestCount = count;
		}
	}
	return best;
}

function checkDrawing(icon: IconFile, svg: string, strokes: boolean) {
	const findings: Finding[] = [];
	const add = (rule: RuleId, amount: number, detail: string) =>
		findings.push({ rule, amount: round(amount), detail });

	const ink = renderInk(svg);
	const box = findBox(ink);
	if (!box) {
		add("blank", 1, "Nothing renders.");
		return { findings, box };
	}
	const isBrand = icon.category === "brands";
	const isOff = icon.name.endsWith("-off");

	const outside = Math.max(
		LIMIT.edgeMin - box.left,
		LIMIT.edgeMin - box.top,
		box.right - LIMIT.edgeMax,
		box.bottom - LIMIT.edgeMax,
	);
	if (outside > SLACK) {
		add(
			"edges",
			outside,
			`Box runs ${round(box.left, 1)} to ${round(box.right, 1)} across and ${round(box.top, 1)} to ${round(box.bottom, 1)} down.`,
		);
	}

	const longest = Math.max(box.right - box.left, box.bottom - box.top);
	const sizeOff = Math.abs(longest - LIMIT.longSide);
	if (!isBrand && !isMark(icon) && sizeOff > LIMIT.longSideSlack) {
		// A stroke keeps its width when the drawing scales, so only the rest grows.
		const scale = strokes
			? (LIMIT.longSide - LIMIT.line) / (longest - LIMIT.line)
			: LIMIT.longSide / longest;
		add(
			"size",
			sizeOff,
			strokes
				? `Longest side is ${round(longest, 1)}, needs ${LIMIT.longSide}. Scale the paths by ${round(scale)}.`
				: `Longest side is ${round(longest, 1)}, needs ${LIMIT.longSide}. It's a filled outline, so scaling by ${round(scale)} also thickens its line. Redraw it with strokes if the line check fails.`,
		);
	}

	const centreX = (box.left + box.right) / 2;
	const centreY = (box.top + box.bottom) / 2;
	const drift = Math.max(Math.abs(centreX - 12), Math.abs(centreY - 12));
	if (drift > LIMIT.centreDrift) {
		add(
			"centre",
			drift,
			`Centre is at ${round(centreX, 1)}, ${round(centreY, 1)}. Move by ${signed(12 - centreX)} across, ${signed(12 - centreY)} down.`,
		);
	}

	// Logos keep their official shape, so only their placement is measured.
	if (isBrand) return { findings, box };

	const { labels, areas } = labelPieces(ink);
	const smallest = Math.min(...areas) / (UNIT * UNIT);
	if (smallest < LIMIT.crumbArea - SLACK) {
		add(
			"crumbs",
			LIMIT.crumbArea - smallest,
			`Smallest piece is ${round(smallest, 1)} square units.`,
		);
	}
	if (isOff && areas.length > LIMIT.offPieces) {
		add(
			"pieces",
			areas.length - LIMIT.offPieces,
			`Breaks into ${areas.length} pieces.`,
		);
	}
	if (areas.length > 1) {
		const needed = isOff ? LIMIT.slashGap : LIMIT.gap;
		const { gap, x, y } = smallestGap(labels, areas.length);
		if (gap < needed - SLACK) {
			add(
				"spacing",
				needed - gap,
				`Parts are ${round(gap)} apart near ${round(x, 1)}, ${round(y, 1)}, needs ${needed}.`,
			);
		}
	}

	if (icon.variant === "linear") {
		const cramped = crampedArea(ink);
		if (cramped > LIMIT.crampedArea) {
			add(
				"cramped",
				cramped - LIMIT.crampedArea,
				`${round(cramped, 1)} square units of tight channels.`,
			);
		}
		const width = mainLineWidth(ink);
		const tooThin = !isMark(icon) && width < LIMIT.line - 0.15;
		if (tooThin || width > LIMIT.line + 0.2) {
			add(
				"line",
				Math.abs(width - LIMIT.line),
				width > 0
					? `Main line is ${width} thick, needs ${LIMIT.line}.`
					: `Main line is under 0.6 thick, needs ${LIMIT.line}.`,
			);
		}
	}
	return { findings, box };
}

async function listIconFiles() {
	const files = new Map<string, Partial<Record<Variant, IconFile>>>();
	for (const variant of VARIANTS) {
		const categories = await readdir(join(iconsDir, variant), {
			withFileTypes: true,
		});
		for (const category of categories) {
			if (!category.isDirectory() || category.name.startsWith(".")) continue;
			const names = await readdir(join(iconsDir, variant, category.name));
			for (const file of names) {
				if (!file.endsWith(".svg")) continue;
				const name = file.slice(0, -4);
				files.set(name, {
					...files.get(name),
					[variant]: { name, category: category.name, variant },
				});
			}
		}
	}
	return new Map([...files].toSorted(([a], [b]) => a.localeCompare(b)));
}

async function readDrawing(icon: IconFile, color?: string) {
	const path = join(iconsDir, icon.variant, icon.category, `${icon.name}.svg`);
	return asShipped(await readFile(path, "utf8"), path, color);
}

async function checkIcons(only: string[]) {
	const files = await listIconFiles();
	for (const name of only) {
		if (!files.has(name)) throw new Error(`Unknown icon "${name}".`);
	}
	const results = new Map<string, Problem[]>();
	for (const [name, { linear, bold }] of files) {
		if (only.length > 0 && !only.includes(name)) continue;
		const problems: Problem[] = [];
		if (!linear || !bold) {
			problems.push({
				rule: "pair",
				amount: 1,
				style: linear ? "linear" : "bold",
				detail: `Has no ${linear ? "bold" : "linear"} version.`,
			});
		} else if (linear.category !== bold.category) {
			problems.push({
				rule: "pair",
				amount: 1,
				style: "both",
				detail: `Linear is in ${linear.category}, bold is in ${bold.category}.`,
			});
		}
		const boxes: Box[] = [];
		if (!isSpinner(name)) {
			for (const icon of [linear, bold]) {
				if (!icon) continue;
				const { svg, strokes } = await readDrawing(icon);
				const { findings, box } = checkDrawing(icon, svg, strokes);
				if (box) boxes.push(box);
				for (const finding of findings) {
					const same = problems.find(({ rule }) => rule === finding.rule);
					if (same) {
						same.style = "both";
						same.amount = Math.max(same.amount, finding.amount);
					} else {
						problems.push({ ...finding, style: icon.variant });
					}
				}
			}
		}
		const [a, b] = boxes;
		if (a && b) {
			const drift = Math.max(
				Math.abs(a.left - b.left),
				Math.abs(a.right - b.right),
				Math.abs(a.top - b.top),
				Math.abs(a.bottom - b.bottom),
			);
			if (drift > LIMIT.boxDrift) {
				problems.push({
					rule: "box",
					amount: round(drift),
					style: "bold",
					detail: `Bold's box is off from linear's by ${round(drift, 1)}.`,
				});
			}
		}
		results.set(name, problems);
	}
	return results;
}

/** Room around the icon while fitting, so a drawing outside the box isn't clipped. */
const FIT_MARGIN = 12;

function measureWide(svg: string): Box {
	const units = 24 + 2 * FIT_MARGIN;
	const side = units * UNIT;
	const wide = svg.replace(
		'viewBox="0 0 24 24"',
		`viewBox="${-FIT_MARGIN} ${-FIT_MARGIN} ${units} ${units}"`,
	);
	const { pixels } = new Resvg(wide, {
		fitTo: { mode: "width", value: side },
		font: { loadSystemFonts: false },
	}).render();
	let left = side;
	let right = -1;
	let top = side;
	let bottom = -1;
	for (let y = 0; y < side; y++) {
		for (let x = 0; x < side; x++) {
			if (at(pixels, (x + y * side) * 4 + 3) <= 127) continue;
			if (x < left) left = x;
			if (x > right) right = x;
			if (y < top) top = y;
			if (y > bottom) bottom = y;
		}
	}
	if (right < 0) throw new Error("Nothing renders, so there's nothing to fit.");
	return {
		left: left / UNIT - FIT_MARGIN,
		right: (right + 1) / UNIT - FIT_MARGIN,
		top: top / UNIT - FIT_MARGIN,
		bottom: (bottom + 1) / UNIT - FIT_MARGIN,
	};
}

const longestSide = (box: Box) =>
	Math.max(box.right - box.left, box.bottom - box.top);
const centreOf = (box: Box) => ({
	x: (box.left + box.right) / 2,
	y: (box.top + box.bottom) / 2,
});

type FitTarget = { longest?: number; x: number; y: number };

/** Returns the fitted source and its box. Throws if it can't reach the target. */
function fitSource(source: string, file: string, target: FitTarget) {
	let next = source;
	let scaled = 1;
	for (let attempt = 0; attempt < 4; attempt++) {
		const { svg, strokes } = asShipped(next, file);
		const box = measureWide(svg);
		const inset = strokes ? LIMIT.line : 0;
		if (target.longest && longestSide(box) - inset < 1) {
			throw new Error(`${file}: too small to scale.`);
		}
		const scale = target.longest
			? (target.longest - inset) / (longestSide(box) - inset)
			: 1;
		const { x, y } = centreOf(box);
		const settled =
			Math.abs(scale - 1) < 0.002 &&
			Math.abs(x - target.x) < 0.03 &&
			Math.abs(y - target.y) < 0.03;
		if (settled) break;
		scaled *= scale;
		next = fitDrawing(next, {
			scale,
			dx: target.x - x * scale,
			dy: target.y - y * scale,
		});
	}
	const box = measureWide(asShipped(next, file).svg);
	const { x, y } = centreOf(box);
	const sizeMissed =
		target.longest && Math.abs(longestSide(box) - target.longest) > 0.1;
	if (
		sizeMissed ||
		Math.abs(x - target.x) > 0.1 ||
		Math.abs(y - target.y) > 0.1
	) {
		throw new Error(
			`${file}: couldn't fit it, so it's unchanged. Fit it by hand.`,
		);
	}
	return { source: next, box, scaled };
}

/** Fits icons in both styles. Linear decides the box, and bold follows it. */
async function fitIcons(names: string[]) {
	const files = await listIconFiles();
	for (const name of names) {
		const pair = files.get(name);
		if (!pair) throw new Error(`Unknown icon "${name}".`);
		const { linear, bold } = pair;
		if (!linear || !bold) throw new Error(`${name} needs both styles to fit.`);
		if (isSpinner(name)) {
			throw new Error(
				`${name} is made of faint animated parts. Fit it by hand.`,
			);
		}
		const linearPath = join(iconsDir, "linear", linear.category, `${name}.svg`);
		const boldPath = join(iconsDir, "bold", bold.category, `${name}.svg`);
		const linearSource = await readFile(linearPath, "utf8");
		const boldSource = await readFile(boldPath, "utf8");

		const before = measureWide(asShipped(linearSource, linearPath).svg);
		const { x, y } = centreOf(before);
		const resize =
			linear.category !== "brands" &&
			!isMark(linear) &&
			Math.abs(longestSide(before) - LIMIT.longSide) > LIMIT.longSideSlack;
		const drift = Math.max(Math.abs(x - 12), Math.abs(y - 12));
		if (!resize && drift <= LIMIT.centreDrift) {
			console.log(`${name}: already fits, left alone.`);
			continue;
		}

		const fitted = fitSource(linearSource, linearPath, {
			longest: resize ? LIMIT.longSide : undefined,
			x: 12,
			y: 12,
		});
		const centre = centreOf(fitted.box);
		const boldFitted =
			linearSource === boldSource
				? fitted
				: fitSource(boldSource, boldPath, {
						longest: resize ? longestSide(fitted.box) : undefined,
						...centre,
					});
		// Written last, so a failure leaves both files as they were.
		await writeFile(linearPath, fitted.source);
		await writeFile(boldPath, boldFitted.source);

		const size = `${round(fitted.box.right - fitted.box.left, 1)} × ${round(fitted.box.bottom - fitted.box.top, 1)}`;
		const notes = [
			resize && !asShipped(linearSource, linearPath).strokes
				? "Linear is a filled outline, so its line grew too."
				: "",
			linearSource !== boldSource && boldFitted.scaled > 1.05
				? `Bold grew ${round(boldFitted.scaled)} times, gaps included, so derive it again if they look wide.`
				: "",
		].filter(Boolean);
		console.log(`${name}: now ${size}, centred. ${notes.join(" ")}`.trimEnd());
	}
}

/** One sheet with each icon beside three neighbours from its category, at real pixels. */
async function writeLookSheet(names: string[]) {
	const files = await listIconFiles();
	const sizes = [16, 20, 24, 96];
	const themes = [
		{ background: "#fafafa", ink: "#27272a" },
		{ background: "#18181b", ink: "#f4f4f5" },
	];
	const labelWidth = 130;
	const gap = 10;
	const rowHeight = Math.max(...sizes) + 2 * gap;
	const width =
		labelWidth +
		sizes.reduce((sum, size) => sum + 4 * (size + gap) + gap * 2, 0);
	const parts: string[] = [];
	let y = 0;
	for (const { background, ink } of themes) {
		const start = y;
		const rows: string[] = [];
		for (const name of names) {
			const icon = files.get(name);
			if (!icon) throw new Error(`Unknown icon "${name}".`);
			const category = (icon.linear ?? icon.bold)?.category;
			const family = [...files.values()].flatMap(({ linear, bold }) => {
				const file = linear ?? bold;
				return file && file.category === category ? [file.name] : [];
			});
			const index = family.indexOf(name);
			const neighbours = family
				.filter((other) => other !== name)
				.toSorted(
					(a, b) =>
						Math.abs(family.indexOf(a) - index) -
						Math.abs(family.indexOf(b) - index),
				)
				.slice(0, 3);
			for (const variant of VARIANTS) {
				let x = labelWidth;
				rows.push(
					`<text x="8" y="${y + rowHeight / 2}" font-size="11" font-family="sans-serif" fill="${ink}">${name} ${variant}</text>`,
				);
				for (const size of sizes) {
					for (const shown of [name, ...neighbours]) {
						const file = files.get(shown)?.[variant];
						if (file) {
							const { svg } = await readDrawing(file, ink);
							rows.push(
								svg.replace(
									"<svg ",
									`<svg x="${x}" y="${y + (rowHeight - size) / 2}" width="${size}" height="${size}" `,
								),
							);
						}
						x += size + gap;
					}
					x += gap * 2;
				}
				y += rowHeight;
			}
		}
		parts.push(
			`<rect x="0" y="${start}" width="${width}" height="${y - start}" fill="${background}"/>`,
			...rows,
		);
	}
	const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${y}" viewBox="0 0 ${width} ${y}">${parts.join("")}</svg>`;
	const out = join(tmpdir(), "honeyicons-look.png");
	await writeFile(out, new Resvg(sheet).render().asPng());
	console.log(
		`${out}\nEach row: the icon, then three neighbours, at 16, 20, 24 and 96px, light and dark. Open it at full size, because one image pixel is one screen pixel.`,
	);
}

const loadIssues = async (): Promise<KnownIssues> =>
	JSON.parse(await readFile(issuesPath, "utf8"));

const saveIssues = (issues: KnownIssues) =>
	writeFile(issuesPath, `${JSON.stringify(issues, null, "\t")}\n`);

const label = ({ rule, style }: Problem) => `[${rule}, ${style}]`;

function printRules() {
	for (const rule of RULE_IDS) {
		const { what, fix } = RULES[rule];
		console.log(`${rule}\n  ${what}\n  Fix: ${fix}`);
	}
}

function printTodo(
	results: Map<string, Problem[]>,
	issues: KnownIssues,
	onlyRule: string | undefined,
) {
	for (const rule of RULE_IDS) {
		if (onlyRule && rule !== onlyRule) continue;
		const rows: string[] = [];
		for (const [name, problems] of results) {
			if (issues.measured[name]?.[rule] === undefined) continue;
			const problem = problems.find((candidate) => candidate.rule === rule);
			if (problem) {
				rows.push(
					`  ${name.padEnd(24)} ${problem.style.padEnd(7)}${problem.detail}`,
				);
			}
		}
		if (rows.length > 0) {
			console.log(
				`\n${rule}: ${rows.length} icons. ${RULES[rule].fix}\n${rows.join("\n")}`,
			);
		}
	}
	const flagged = Object.entries(issues.flagged);
	if (!onlyRule && flagged.length > 0) {
		console.log(`\nflagged by a person: ${flagged.length} icons.`);
		for (const [name, note] of flagged) {
			console.log(`  ${name.padEnd(24)} ${note}`);
		}
	}
}

function rebaseline(results: Map<string, Problem[]>, issues: KnownIssues) {
	const measured: KnownIssues["measured"] = {};
	for (const [name, problems] of results) {
		const accepted = issues.accepted[name] ?? {};
		const listed = problems.filter(({ rule }) => !accepted[rule]);
		if (listed.length > 0) {
			measured[name] = Object.fromEntries(
				listed.map(({ rule, amount }) => [rule, amount]),
			);
		}
	}
	return { ...issues, measured };
}

/** Drops whatever is fixed or gone, and locks in any improvement. */
function prune(results: Map<string, Problem[]>, issues: KnownIssues) {
	let removed = 0;
	const measured: KnownIssues["measured"] = {};
	for (const [name, listed] of Object.entries(issues.measured)) {
		const kept: Partial<Record<RuleId, number>> = {};
		for (const [rule, amount] of Object.entries(listed) as [RuleId, number][]) {
			const current = results.get(name)?.find((p) => p.rule === rule);
			if (current) kept[rule] = Math.min(amount, current.amount);
			else removed++;
		}
		if (Object.keys(kept).length > 0) measured[name] = kept;
	}
	const flagged = Object.fromEntries(
		Object.entries(issues.flagged).filter(([name]) => {
			const exists = results.has(name);
			if (!exists) removed++;
			return exists;
		}),
	);
	const accepted: KnownIssues["accepted"] = {};
	for (const [name, rules] of Object.entries(issues.accepted)) {
		const kept = Object.entries(rules).filter(([rule]) =>
			results.get(name)?.some((p) => p.rule === rule),
		);
		removed += Object.keys(rules).length - kept.length;
		if (kept.length > 0) accepted[name] = Object.fromEntries(kept);
	}
	return { issues: { accepted, measured, flagged }, removed };
}

/** Prints what changed against the to-do list. Returns whether the check failed. */
function report(
	results: Map<string, Problem[]>,
	issues: KnownIssues,
	only: string[],
) {
	const single = only.length > 0;
	let failed = false;
	for (const [name, problems] of results) {
		const known = issues.measured[name] ?? {};
		const accepted = issues.accepted[name] ?? {};
		let fixed = 0;
		for (const problem of problems) {
			if (accepted[problem.rule]) continue;
			const was = known[problem.rule];
			const { fix } = RULES[problem.rule];
			if (was === undefined || problem.amount > was + WORSE_BY) {
				failed = true;
				const status = was === undefined ? "NEW  " : "WORSE";
				console.log(
					`${status} ${name} ${label(problem)} ${problem.detail}\n      Fix: ${fix}`,
				);
			} else if (single) {
				console.log(
					`known ${name} ${label(problem)} ${problem.detail}\n      Fix: ${fix}`,
				);
			}
		}
		const current = (rule: string) => problems.some((p) => p.rule === rule);
		for (const rule of [...Object.keys(known), ...Object.keys(accepted)]) {
			if (current(rule)) continue;
			fixed++;
			if (!single) failed = true;
			console.log(
				`FIXED ${name} [${rule}] Run pnpm check:icons --prune to take it off the list.`,
			);
		}
		if (single) {
			const note = issues.flagged[name];
			if (note) console.log(`known ${name} [flagged] ${note}`);
			if (problems.length === 0 && !note && fixed === 0) {
				console.log(`ok    ${name}`);
			}
		}
	}
	if (!single) {
		const listed = new Set([
			...Object.keys(issues.measured),
			...Object.keys(issues.flagged),
		]);
		for (const name of [...listed, ...Object.keys(issues.accepted)]) {
			if (!results.has(name)) {
				failed = true;
				console.log(
					`GONE  ${name} is on the list but has no icon. Run pnpm check:icons --prune.`,
				);
			}
		}
		console.log(
			`${failed ? "Failed." : "No new problems."} ${listed.size} icons on the to-do list: pnpm check:icons --todo`,
		);
	}
	return failed;
}

const HELP = `pnpm check:icons                 Check every icon. Fails on new or worse problems, and on fixed problems still listed.
pnpm check:icons <name> ...      Show every problem on these icons, known or new.
pnpm check:icons --todo [rule]   List the known problems, with what to do about each.
pnpm check:icons --rules         List the rules and their limits.
pnpm check:icons --look <name>   Render icons beside their neighbours at real sizes, for the look test.
pnpm check:icons --fit <name>    Move and scale icons in both styles so they pass the size and centre rules.
pnpm check:icons --prune         Remove fixed problems from scripts/known-icon-issues.json.
pnpm check:icons --rebaseline    Replace the measured list with today's results. Only when the user asks or a limit changed.`;

const OPTIONS = [
	"--help",
	"--rules",
	"--todo",
	"--look",
	"--fit",
	"--prune",
	"--rebaseline",
];

function validate(flags: string[], rest: string[]) {
	const [flag] = flags;
	if (flags.length > 1) throw new Error(`Use one option at a time.\n\n${HELP}`);
	if (flag && !OPTIONS.includes(flag)) {
		throw new Error(`Unknown option ${flag}.\n\n${HELP}`);
	}
	if ((flag === "--look" || flag === "--fit") && rest.length === 0) {
		throw new Error(`${flag} needs at least one icon name.`);
	}
	if (flag === "--todo") {
		const [rule, extra] = rest;
		if (extra || (rule && !(RULE_IDS as string[]).includes(rule))) {
			throw new Error(`--todo takes one rule from: ${RULE_IDS.join(", ")}.`);
		}
	} else if (flag && flag !== "--look" && flag !== "--fit" && rest.length > 0) {
		throw new Error(`${flag} doesn't take icon names.`);
	}
}

async function main() {
	const args = process.argv.slice(2);
	const flags = args.filter((arg) => arg.startsWith("--"));
	const rest = args.filter((arg) => !arg.startsWith("--"));
	validate(flags, rest);
	const [flag] = flags;

	if (flag === "--help") return console.log(HELP);
	if (flag === "--rules") return printRules();
	if (flag === "--look") return writeLookSheet(rest);
	if (flag === "--fit") return fitIcons(rest);

	const issues = await loadIssues();
	const only = flag ? [] : rest;
	const results = await checkIcons(only);

	if (flag === "--todo") return printTodo(results, issues, rest[0]);
	if (flag === "--rebaseline") {
		const next = rebaseline(results, issues);
		await saveIssues(next);
		return console.log(
			`Listed problems on ${Object.keys(next.measured).length} icons.`,
		);
	}
	if (flag === "--prune") {
		const { issues: next, removed } = prune(results, issues);
		await saveIssues(next);
		return console.log(`Removed ${removed} fixed problems from the list.`);
	}
	if (report(results, issues, only)) process.exitCode = 1;
}

try {
	await main();
} catch (error) {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
}

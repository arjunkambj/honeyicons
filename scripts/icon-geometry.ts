// Moves and uniformly scales the coordinates inside an SVG, so strokes keep their
// width. A transform attribute would scale the stroke along with the drawing.

export type Fit = { scale: number; dx: number; dy: number };

const NUMBER_TEXT = String.raw`[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?`;
const NUMBER = new RegExp(String.raw`\s*,?\s*(${NUMBER_TEXT})`, "y");
const ANY_NUMBER = new RegExp(NUMBER_TEXT, "g");
const FLAG = /\s*,?\s*([01])/y;
const COMMAND = /\s*([a-zA-Z])/y;

const PRECISION = 10000;
const format = (value: number) =>
	String(Math.round(value * PRECISION) / PRECISION);

/**
 * A half circle has a radius of exactly half its chord, and an arc that is a hair
 * too big bows far from where it should. A hair too small gets scaled to fit by the
 * renderer, so radii that close are rounded down to just under the chord.
 */
function arcRadius(radius: number, chord: number) {
	const half = chord / 2;
	return Math.abs(radius - half) < 0.002
		? Math.floor(half * PRECISION) / PRECISION
		: radius;
}

/** Rewrites path data with absolute commands, keeping arcs and curve types. */
function fitPath(d: string, { scale, dx, dy }: Fit) {
	let index = 0;
	const read = (pattern: RegExp) => {
		pattern.lastIndex = index;
		const match = pattern.exec(d);
		if (!match) return undefined;
		index = pattern.lastIndex;
		return match[1];
	};
	const number = () => {
		const value = read(NUMBER);
		if (value === undefined)
			throw new Error(`Bad path data near "${d.slice(index, index + 20)}"`);
		return Number(value);
	};
	const hasNumber = () => {
		NUMBER.lastIndex = index;
		return NUMBER.test(d);
	};
	const toX = (x: number) => format(x * scale + dx);
	const toY = (y: number) => format(y * scale + dy);

	let out = "";
	let x = 0;
	let y = 0;
	let startX = 0;
	let startY = 0;
	while (index < d.length) {
		const letter = read(COMMAND);
		if (letter === undefined) break;
		const upper = letter.toUpperCase();
		const relative = letter !== upper;
		if (upper === "Z") {
			out += "Z";
			x = startX;
			y = startY;
			continue;
		}
		let first = true;
		do {
			const baseX = relative ? x : 0;
			const baseY = relative ? y : 0;
			const point = () => {
				const px = number() + baseX;
				const py = number() + baseY;
				return [px, py] as const;
			};
			if (upper === "H") {
				x = number() + baseX;
				out += `H${toX(x)}`;
			} else if (upper === "V") {
				y = number() + baseY;
				out += `V${toY(y)}`;
			} else if (upper === "A") {
				const rx = number();
				const ry = number();
				const rotation = number();
				const large = read(FLAG);
				const sweep = read(FLAG);
				const [px, py] = point();
				const chord = Math.hypot(
					Number(toX(px)) - Number(toX(x)),
					Number(toY(py)) - Number(toY(y)),
				);
				const radiusX = format(arcRadius(rx * scale, chord));
				const radiusY = format(arcRadius(ry * scale, chord));
				out += `A${radiusX} ${radiusY} ${format(rotation)} ${large} ${sweep} ${toX(px)} ${toY(py)}`;
				x = px;
				y = py;
			} else {
				const pairs = { M: 1, L: 1, T: 1, S: 2, Q: 2, C: 3 }[upper];
				if (!pairs) throw new Error(`Unknown path command ${letter}`);
				const points = Array.from({ length: pairs }, point);
				const end = points.at(-1) as readonly [number, number];
				// Extra pairs after a move are lines.
				const name = upper === "M" && !first ? "L" : upper;
				out += `${name}${points.map(([px, py]) => `${toX(px)} ${toY(py)}`).join(" ")}`;
				[x, y] = end;
				if (upper === "M" && first) {
					startX = x;
					startY = y;
				}
			}
			first = false;
		} while (hasNumber());
	}
	if (d.slice(index).trim()) {
		throw new Error(`Bad path data near "${d.slice(index, index + 20)}"`);
	}
	return out;
}

const SHAPES: Record<string, { x: string[]; y: string[]; size: string[] }> = {
	circle: { x: ["cx"], y: ["cy"], size: ["r"] },
	ellipse: { x: ["cx"], y: ["cy"], size: ["rx", "ry"] },
	rect: { x: ["x"], y: ["y"], size: ["width", "height", "rx", "ry"] },
	line: { x: ["x1", "x2"], y: ["y1", "y2"], size: [] },
};

const setAttr = (
	from: string,
	name: string,
	change: (value: string) => string,
) =>
	from.replace(
		new RegExp(`(\\s${name}=")([^"]*)(")`),
		(_, open, value, close) => `${open}${change(value)}${close}`,
	);

function numeric(value: string) {
	const number = Number(value);
	if (Number.isNaN(number)) throw new Error(`Can't fit the value "${value}".`);
	return number;
}

function fitNode(tag: string, attrs: string, fit: Fit) {
	const { scale, dx, dy } = fit;
	if (tag === "path") return setAttr(attrs, "d", (d) => fitPath(d, fit));
	if (tag === "polygon" || tag === "polyline") {
		return setAttr(attrs, "points", (points) =>
			(points.match(ANY_NUMBER) ?? [])
				.map((value, i) =>
					format(Number(value) * scale + (i % 2 === 0 ? dx : dy)),
				)
				.join(" "),
		);
	}
	const shape = SHAPES[tag];
	if (!shape) return attrs;
	// A missing position counts as 0, and moving it has to write it out.
	let next = attrs;
	for (const name of [...shape.x, ...shape.y]) {
		if (!new RegExp(`\\s${name}="`).test(next)) next += ` ${name}="0"`;
	}
	for (const name of shape.x) {
		next = setAttr(next, name, (v) => format(numeric(v) * scale + dx));
	}
	for (const name of shape.y) {
		next = setAttr(next, name, (v) => format(numeric(v) * scale + dy));
	}
	for (const name of shape.size) {
		next = setAttr(next, name, (v) => format(numeric(v) * scale));
	}
	return next;
}

export const doubleQuoted = (source: string) =>
	source.replace(/=\s*'([^']*)'/g, '="$1"');

/** Applies a fit to a whole source file. Everything but the coordinates stays as written. */
export function fitDrawing(input: string, fit: Fit) {
	const source = doubleQuoted(input);
	const open = source.match(/<svg\b[^>]*>/i);
	if (!open || open.index === undefined) throw new Error("missing <svg>");
	const bodyStart = open.index + open[0].length;
	const bodyEnd = source.lastIndexOf("</svg>");
	const body = source.slice(bodyStart, bodyEnd);
	const head = source.slice(0, bodyStart);
	const tail = source.slice(bodyEnd);

	// Transforms, paint servers, and masks have their own coordinates. Moving the
	// group is exact for them, and they only appear in logos, which never scale.
	if (/\btransform=|<defs\b|url\(#/.test(body)) {
		if (fit.scale !== 1) {
			throw new Error("Has transforms or paint servers, so it can only move.");
		}
		const inner = body.replace(/^\n/, "").replace(/\s+$/, "");
		const indented = inner.replaceAll("\n", "\n  ");
		return `${head}\n  <g transform="translate(${format(fit.dx)} ${format(fit.dy)})">\n  ${indented}\n  </g>\n${tail}`;
	}
	const next = body.replace(
		/<(path|circle|ellipse|rect|line|polygon|polyline)\b([^>]*?)(\/?)>/g,
		(_, tag, attrs, close) => `<${tag}${fitNode(tag, attrs, fit)}${close}>`,
	);
	return `${head}${next}${tail}`;
}

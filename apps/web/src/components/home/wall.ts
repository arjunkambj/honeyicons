import { catalog } from "@honeyicons/react/catalog";

/* The icon wall shared by the home stage and the page headers. */

// A fixed shuffle, so brand colors are sprinkled across the wall instead of
// sitting in one block, and the wall looks the same on every visit.
function seededShuffle<T>(items: readonly T[], seed: number) {
	const order = [...items];
	let state = seed;
	const random = () => {
		state = (state + 0x6d2b79f5) | 0;
		let t = Math.imul(state ^ (state >>> 15), 1 | state);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
	for (let i = order.length - 1; i > 0; i--) {
		const j = Math.floor(random() * (i + 1));
		[order[i], order[j]] = [order[j], order[i]];
	}
	return order;
}

// Brand icons in their own colors go on an even lattice, so every view of
// the wall has some color in it. Everything else fills the gaps in a fixed shuffle.
function layoutTiles() {
	const colored = seededShuffle(
		catalog.filter((item) => item.name.endsWith("-color")),
		3,
	);
	const rest = seededShuffle(
		catalog.filter((item) => !item.name.endsWith("-color")),
		7,
	);
	const tiles: (typeof catalog)[number][] = [];
	const step = catalog.length / colored.length;
	let next = 0;
	for (let index = 0; index < catalog.length; index++) {
		const due = Math.round(next * step + step / 2) <= index;
		const item = due && next < colored.length ? colored[next++] : rest.shift();
		if (!item) throw new Error("The home wall ran out of icons to place");
		tiles.push(item);
	}
	return tiles;
}

// Some plain icons wear a color too, to show they take whatever color you set.
const TINTS = [
	"text-sky-500",
	"text-rose-500",
	"text-emerald-500",
	"text-violet-500",
	"text-amber-500",
	"text-orange-500",
];
export function tintFor(index: number) {
	if (wallTiles[index]?.category === "brands") return undefined;
	const hash = Math.imul(index + 11, 2654435761) >>> 0;
	return hash % 4 === 0 ? TINTS[(hash >>> 3) % TINTS.length] : undefined;
}

export const wallTiles = layoutTiles();

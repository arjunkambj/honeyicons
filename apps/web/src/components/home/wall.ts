import { catalog } from "@honeyicons/react/catalog";

/* The icon wall behind the home page. */

// A fixed shuffle, so the wall looks the same on every visit.
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

// One logo for every this many plain icons, so a view holds only a few.
const PLAIN_ICONS_PER_LOGO = 13;

// The wall stays one color to back up the claim that the set matches: it leaves
// out the color versions and keeps a thin, even scatter of the plain logos.
function layoutTiles() {
	const singleColor = catalog.filter((item) => !item.name.endsWith("-color"));
	const plain = seededShuffle(
		singleColor.filter((item) => item.category !== "brands"),
		7,
	);
	const logos = seededShuffle(
		singleColor.filter((item) => item.category === "brands"),
		3,
	);
	return plain.flatMap((item, index) => {
		const logoDue = (index + 1) % PLAIN_ICONS_PER_LOGO === 0;
		const logo = logoDue
			? logos[(index + 1) / PLAIN_ICONS_PER_LOGO - 1]
			: undefined;
		return logo ? [item, logo] : [item];
	});
}

export const wallTiles = layoutTiles();

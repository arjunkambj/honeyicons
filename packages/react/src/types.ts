export const ICON_VARIANTS = ["linear", "bold"] as const;

export type IconVariant = (typeof ICON_VARIANTS)[number];

export const DEFAULT_STROKE_WIDTH = { linear: 1.6, bold: 1.8 } as const;

export type IconElement = [
	tag: string,
	attrs: Record<string, string>,
	children?: IconElement[],
];

export type IconNode = IconElement[];

export type IconNodeMap = Partial<Record<IconVariant, IconNode>>;

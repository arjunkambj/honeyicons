export const ICON_VARIANTS = ["linear", "bold"] as const;

export type IconVariant = (typeof ICON_VARIANTS)[number];

export type IconElement = [
	tag: string,
	attrs: Record<string, string>,
	children?: IconElement[],
];

export type IconNode = IconElement[];

export type IconNodeMap = Partial<Record<IconVariant, IconNode>>;

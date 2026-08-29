export const ICON_VARIANTS = ["linear", "bold", "duotone"] as const;

export type IconVariant = (typeof ICON_VARIANTS)[number];

export type IconNode = [tag: string, attrs: Record<string, string>][];

export type IconNodeMap = { linear: IconNode } & Partial<
	Record<Exclude<IconVariant, "linear">, IconNode>
>;

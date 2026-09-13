import {
	Check,
	ChevronRight,
	Folder,
	type HoneyIcon,
	type IconCategory,
	Layers,
	SidebarLeft,
	UserGroup,
	Widget,
} from "@honeyicons/react";

export const SIZE_MIN = 16;
export const SIZE_MAX = 460;
export const SIZE_DEFAULT = 28;
export const SIZE_MAJOR_STEP = 4;

export type CategoryFilter = "all" | IconCategory;

export const CATEGORY_META: {
	id: CategoryFilter;
	label: string;
	icon: HoneyIcon;
}[] = [
	{ id: "all", label: "All", icon: Widget },
	{ id: "actions", label: "Actions", icon: Check },
	{ id: "social", label: "Social", icon: UserGroup },
	{ id: "layout", label: "Layout", icon: SidebarLeft },
	{ id: "arrows", label: "Arrow", icon: ChevronRight },
	{ id: "files", label: "Folder", icon: Folder },
	{ id: "spinner", label: "Loaders", icon: Layers },
];

export const VARIANT_META = [
	{ id: "linear", label: "Linear" },
	{ id: "bold", label: "Bold" },
	{ id: "duotone", label: "Duotone" },
] as const;

export function sliderNumber(value: number | readonly number[]) {
	const next = Array.isArray(value) ? value[0] : value;
	return next ?? 0;
}

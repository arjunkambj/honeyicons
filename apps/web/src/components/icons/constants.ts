import {
	ArrowRight,
	Check,
	Folder01,
	type HoneyIcon,
	type IconCategory,
	SidebarLeft,
	Spinner,
	UserGroup,
	Widget,
} from "@honeyicons/react";

export const SIZE_MIN = 16;
export const SIZE_MAX = 460;
export const SIZE_DEFAULT = 48;
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
	{ id: "arrows", label: "Arrow", icon: ArrowRight },
	{ id: "files", label: "Folder", icon: Folder01 },
	{ id: "spinner", label: "Loaders", icon: Spinner },
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

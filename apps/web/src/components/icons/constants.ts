import type { IconCategory } from "@honeyicons/react";
import {
	ArrowRight01Icon,
	Folder01Icon,
	LayoutDashboardIcon,
	LayoutGridIcon,
	Loading03Icon,
	SparklesIcon,
	Tick02Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export const SIZE_MIN = 16;
export const SIZE_MAX = process.env.NODE_ENV === "development" ? 460 : 96;
export const SIZE_DEFAULT = 24;
export const SIZE_MAJOR_STEP = 4;

export type CategoryFilter = "all" | IconCategory;

export const CATEGORY_META: {
	id: CategoryFilter;
	label: string;
	icon: IconSvgElement;
}[] = [
	{ id: "all", label: "All", icon: LayoutGridIcon },
	{ id: "actions", label: "Actions", icon: Tick02Icon },
	{ id: "ai", label: "AI Labs", icon: SparklesIcon },
	{ id: "layout", label: "Layout", icon: LayoutDashboardIcon },
	{ id: "arrows", label: "Arrow", icon: ArrowRight01Icon },
	{ id: "files", label: "Folder", icon: Folder01Icon },
	{ id: "spinner", label: "Loaders", icon: Loading03Icon },
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

import type { IconCategory } from "@honeyicons/react";
import {
	Alert02Icon,
	ArrowRight01Icon,
	ChatIcon,
	File01Icon,
	GitBranchIcon,
	Image01Icon,
	LayoutDashboardIcon,
	LayoutGridIcon,
	Loading03Icon,
	Settings01Icon,
	SourceCodeIcon,
	SparklesIcon,
	Tick02Icon,
	UserIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export const SIZE_MIN = 16;
export const SIZE_MAX = 96;
export const SIZE_DEFAULT = 24;
export const STROKE_MIN = 0.5;
export const STROKE_MAX = 2.5;
export const STROKE_STEP = 0.25;
export const STROKE_DEFAULT = 1.5;

export type CategoryFilter = "all" | IconCategory;

export const CATEGORY_META: {
	id: CategoryFilter;
	label: string;
	icon: IconSvgElement;
}[] = [
	{ id: "all", label: "All", icon: LayoutGridIcon },
	{ id: "actions", label: "Actions", icon: Tick02Icon },
	{ id: "ai", label: "AI", icon: SparklesIcon },
	{ id: "arrows", label: "Arrows", icon: ArrowRight01Icon },
	{ id: "chat", label: "Chat", icon: ChatIcon },
	{ id: "editor", label: "Editor", icon: SourceCodeIcon },
	{ id: "files", label: "Files", icon: File01Icon },
	{ id: "git", label: "Git", icon: GitBranchIcon },
	{ id: "layout", label: "Layout", icon: LayoutDashboardIcon },
	{ id: "media", label: "Media", icon: Image01Icon },
	{ id: "settings", label: "Settings", icon: Settings01Icon },
	{ id: "spinner", label: "Spinner", icon: Loading03Icon },
	{ id: "status", label: "Status", icon: Alert02Icon },
	{ id: "user", label: "User", icon: UserIcon },
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

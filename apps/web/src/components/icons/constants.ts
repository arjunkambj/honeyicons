import {
	Activity,
	AlertTriangle,
	ArrowRight,
	Brain,
	Cart,
	Chat,
	Check,
	Clock,
	CloudRain,
	Code,
	Figma,
	Folder,
	type HoneyIcon,
	ICON_CATEGORIES,
	ICON_VARIANTS,
	type IconCategory,
	type IconVariant,
	Lock,
	MapPin,
	Pen,
	Play,
	Rocket,
	Settings,
	SidebarLeft,
	Smartphone,
	User,
	Widget,
} from "@honeyicons/react";

export const SIZE_MIN = 16;
export const SIZE_MAX = 460;
export const SIZE_DEFAULT = 28;

export type CategoryFilter = "all" | IconCategory;

type CategoryMeta = { label: string; icon: HoneyIcon };

export const CATEGORY_DETAILS: Record<CategoryFilter, CategoryMeta> = {
	all: { label: "All", icon: Widget },
	actions: { label: "Actions", icon: Check },
	ai: { label: "AI", icon: Brain },
	arrows: { label: "Arrows", icon: ArrowRight },
	brands: { label: "Brands", icon: Figma },
	charts: { label: "Charts", icon: Activity },
	chat: { label: "Chat", icon: Chat },
	commerce: { label: "Commerce", icon: Cart },
	development: { label: "Development", icon: Code },
	devices: { label: "Devices", icon: Smartphone },
	editor: { label: "Editor", icon: Pen },
	files: { label: "Files & Folders", icon: Folder },
	layout: { label: "Layout", icon: SidebarLeft },
	maps: { label: "Maps & Places", icon: MapPin },
	media: { label: "Media", icon: Play },
	objects: { label: "Objects & Shapes", icon: Rocket },
	security: { label: "Security", icon: Lock },
	settings: { label: "Settings", icon: Settings },
	status: { label: "Status", icon: AlertTriangle },
	time: { label: "Time", icon: Clock },
	user: { label: "Users", icon: User },
	weather: { label: "Weather", icon: CloudRain },
};

export const CATEGORY_META = (["all", ...ICON_CATEGORIES] as const).map(
	(id) => ({ id, ...CATEGORY_DETAILS[id] }),
);

export const VARIANT_META = [
	{ id: "linear", label: "Linear" },
	{ id: "bold", label: "Bold" },
] as const;

/** Catalog filters kept in the URL so views can be shared and restored. */
export type IconsSearch = {
	q?: string;
	category?: IconCategory;
	style?: IconVariant;
};

export function parseIconsSearch(search: Record<string, unknown>): IconsSearch {
	const { q, category, style } = search;
	// The router JSON-parses values, so `?q=404` arrives as a number.
	const text = typeof q === "string" || typeof q === "number" ? String(q) : "";
	return {
		q: text || undefined,
		category: ICON_CATEGORIES.find((id) => id === category),
		style: ICON_VARIANTS.find((id) => id === style && id !== "linear"),
	};
}

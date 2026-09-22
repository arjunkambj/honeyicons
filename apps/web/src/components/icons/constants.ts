import {
	Activity,
	AlertTriangle,
	ArrowRight,
	Brain,
	Cart,
	Chat,
	Check,
	Clock,
	Code,
	Diamond,
	Figma,
	Folder,
	type HoneyIcon,
	ICON_CATEGORIES,
	type IconCategory,
	Lock,
	MapPin,
	Pen,
	Play,
	Rocket,
	Settings,
	SidebarLeft,
	Smartphone,
	Spinner,
	User,
	Widget,
} from "@honeyicons/react";

export const SIZE_MIN = 16;
export const SIZE_MAX = 460;
export const SIZE_DEFAULT = 28;
export const SIZE_MAJOR_STEP = 4;

export type CategoryFilter = "all" | IconCategory;

type CategoryMeta = { label: string; icon: HoneyIcon };

const CATEGORY_DETAILS: Record<IconCategory, CategoryMeta> = {
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
	objects: { label: "Objects", icon: Rocket },
	security: { label: "Security", icon: Lock },
	settings: { label: "Settings", icon: Settings },
	shapes: { label: "Shapes", icon: Diamond },
	spinner: { label: "Spinners", icon: Spinner },
	status: { label: "Status", icon: AlertTriangle },
	time: { label: "Time", icon: Clock },
	user: { label: "Users", icon: User },
};

export const CATEGORY_META: ({ id: CategoryFilter } & CategoryMeta)[] = [
	{ id: "all", label: "All", icon: Widget },
	...ICON_CATEGORIES.map((id) => ({ id, ...CATEGORY_DETAILS[id] })),
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

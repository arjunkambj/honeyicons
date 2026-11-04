import { type IconVariant, Ruler } from "@honeyicons/react";
import { catalog } from "@honeyicons/react/catalog";
import { Button } from "@honeyicons/ui/components/button";
import { cn } from "@honeyicons/ui/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@honeyicons/ui/components/tabs";
import { Toggle } from "@honeyicons/ui/components/toggle";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useLenis } from "lenis/react";
import {
	useEffect,
	useMemo,
	useRef,
	useState,
	useSyncExternalStore,
} from "react";
import {
	CATEGORY_DETAILS,
	type CategoryFilter,
	type IconsSearch,
	SIZE_DEFAULT,
	SIZE_OPTIONS,
	VARIANT_META,
} from "./constants";
import { CategoryChips, CategoryRail } from "./icon-categories";
import { IconDetail } from "./icon-detail";
import { IconGrid } from "./icon-grid";
import { IconSearch } from "./icon-search";

function useMediaQuery(query: string) {
	return useSyncExternalStore(
		(onChange) => {
			const media = window.matchMedia(query);
			media.addEventListener("change", onChange);
			return () => media.removeEventListener("change", onChange);
		},
		() => window.matchMedia(query).matches,
		() => false,
	);
}

function isTypingTarget(target: EventTarget | null) {
	return (
		target instanceof HTMLElement &&
		(target.isContentEditable ||
			target.tagName === "INPUT" ||
			target.tagName === "TEXTAREA" ||
			target.tagName === "SELECT")
	);
}

function matchesQuery(item: (typeof catalog)[number], needle: string) {
	return (
		!needle ||
		item.name.includes(needle) ||
		item.pascalName.toLowerCase().includes(needle) ||
		item.tags.some((tag) => tag.toLowerCase().includes(needle))
	);
}

export function IconBrowser() {
	const inputRef = useRef<HTMLInputElement>(null);
	const lenis = useLenis();
	const search = useSearch({ from: "/icons" });
	const navigate = useNavigate({ from: "/icons" });
	const [size, setSize] = useState(SIZE_DEFAULT);
	const [guides, setGuides] = useState(false);

	const query = search.q ?? "";
	const category: CategoryFilter = search.category ?? "all";
	const variant: IconVariant = search.style ?? "linear";
	const chosenItem = search.icon
		? catalog.find((item) => item.name === search.icon)
		: undefined;
	// On wide screens the detail panel always shows an icon, so the grid
	// never reflows when a panel opens or closes.
	const wide = useMediaQuery("(min-width: 1280px)");

	function updateSearch(next: IconsSearch, replace = false) {
		void navigate({
			search: (prev) => ({ ...prev, ...next }),
			replace,
			resetScroll: false,
		});
	}

	function selectIcon(name: string | undefined) {
		updateSearch({ icon: name }, true);
	}

	function selectCategory(next: CategoryFilter) {
		updateSearch({ category: next === "all" ? undefined : next });
		if (window.scrollY > 0) lenis?.scrollTo(0);
	}

	function selectVariant(next: IconVariant) {
		updateSearch({ style: next === "linear" ? undefined : next });
	}

	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			const isCommandK =
				(event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
			const isSlash = event.key === "/" && !isTypingTarget(event.target);
			if (isCommandK || isSlash) {
				event.preventDefault();
				inputRef.current?.focus();
				inputRef.current?.select();
			} else if (event.key === "Escape" && !isTypingTarget(event.target)) {
				updateSearch({ icon: undefined }, true);
			}
		}
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	});

	const variantItems = useMemo(
		() => catalog.filter((item) => item.variants.includes(variant)),
		[variant],
	);

	const counts = useMemo(() => {
		const next: Record<string, number> = { all: variantItems.length };
		for (const item of variantItems) {
			next[item.category] = (next[item.category] ?? 0) + 1;
		}
		return next;
	}, [variantItems]);

	const needle = query.trim().toLowerCase();

	const items = useMemo(
		() =>
			variantItems.filter(
				(item) =>
					(category === "all" || item.category === category) &&
					matchesQuery(item, needle),
			),
		[category, needle, variantItems],
	);

	const matchesInAllCategories = useMemo(
		() =>
			category === "all"
				? items.length
				: variantItems.filter((item) => matchesQuery(item, needle)).length,
		[category, items.length, needle, variantItems],
	);

	const categoryLabel = CATEGORY_DETAILS[category].label;
	const trimmed = query.trim();

	const empty =
		needle && category !== "all" && matchesInAllCategories > 0
			? {
					title: `Nothing in ${categoryLabel}`,
					description: `${matchesInAllCategories} ${matchesInAllCategories === 1 ? "icon matches" : "icons match"} “${trimmed}” in other categories.`,
					action: (
						<Button onClick={() => selectCategory("all")}>
							Search everywhere
						</Button>
					),
				}
			: needle
				? {
						title: "No icons match",
						description: `Nothing matches “${trimmed}”. Try a shorter word, or describe what the icon shows.`,
						action: (
							<Button
								variant="secondary"
								onClick={() => {
									updateSearch({ q: undefined }, true);
									inputRef.current?.focus();
								}}
							>
								Clear search
							</Button>
						),
					}
				: {
						title: "Nothing here yet",
						description: `${categoryLabel} has no ${variant} icons yet.`,
						action: (
							<Button variant="secondary" onClick={() => selectCategory("all")}>
								Show all icons
							</Button>
						),
					};

	const selectedItem = chosenItem ?? (wide ? items[0] : undefined);

	const detail = selectedItem && (
		<IconDetail
			item={selectedItem}
			variant={variant}
			onVariantChange={selectVariant}
			onTag={(tag) => updateSearch({ q: tag, category: undefined })}
			onClose={wide ? undefined : () => selectIcon(undefined)}
		/>
	);

	return (
		<div className="page-gutter grid flex-1 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10">
			<aside className="no-scrollbar sticky top-14 hidden h-[calc(100svh-3.5rem)] -mx-1.5 overflow-y-auto px-1.5 pt-5 pb-8 lg:block">
				<CategoryRail
					selected={category}
					onSelect={selectCategory}
					counts={counts}
				/>
			</aside>

			<main className="min-w-0 pb-16 xl:pr-[392px]">
				<div className="sticky top-14 z-20 -mx-4 flex flex-col gap-2.5 bg-background/90 px-4 pt-4 pb-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
					<div className="flex items-center gap-1.5 sm:gap-2">
						<IconSearch
							value={query}
							count={variantItems.length}
							onChange={(value) =>
								updateSearch({ q: value || undefined }, true)
							}
							inputRef={inputRef}
						/>
						<Tabs
							value={variant}
							onValueChange={(value) => selectVariant(value as IconVariant)}
						>
							<TabsList aria-label="Icon style">
								{VARIANT_META.map((item) => (
									<TabsTrigger key={item.id} value={item.id}>
										{item.label}
									</TabsTrigger>
								))}
							</TabsList>
						</Tabs>
						<Tabs
							value={String(size)}
							onValueChange={(value) => setSize(Number(value))}
							className="hidden md:flex"
						>
							<TabsList aria-label="Preview size">
								{SIZE_OPTIONS.map((option) => (
									<TabsTrigger
										key={option}
										value={String(option)}
										className="px-2.5 font-mono text-xs tabular-nums"
									>
										{option}
									</TabsTrigger>
								))}
							</TabsList>
						</Tabs>
						<Toggle
							pressed={guides}
							onPressedChange={setGuides}
							aria-label="Show the grid and each icon’s bounds"
							title="Guides"
							className="hidden size-8 min-w-8 px-0 md:inline-flex"
						>
							<Ruler size={16} />
						</Toggle>
					</div>
					<div className="lg:hidden">
						<CategoryChips
							selected={category}
							onSelect={selectCategory}
							counts={counts}
						/>
					</div>
				</div>

				<div className="flex items-baseline gap-2 pt-3 pb-2">
					<h1 className="font-heading font-semibold text-lg tracking-tight">
						{needle ? `“${trimmed}”` : categoryLabel}
					</h1>
					<p
						aria-live="polite"
						className="text-muted-foreground text-sm tabular-nums"
					>
						{items.length}
						{needle && category !== "all" ? ` in ${categoryLabel}` : ""}
					</p>
				</div>

				<IconGrid
					items={items}
					variant={variant}
					size={size}
					guides={guides}
					// Only an icon the visitor picked is highlighted, not the panel default.
					selected={chosenItem?.name}
					onSelect={selectIcon}
					empty={empty}
				/>
			</main>

			{selectedItem && (
				<div
					role="dialog"
					aria-label={`${selectedItem.name} details`}
					className={cn(
						"fade-in-0 fixed z-40 animate-in overflow-y-auto bg-card/80 shadow-xxs backdrop-blur-xl duration-200",
						"inset-x-0 bottom-0 max-h-[78svh] slide-in-from-bottom-8 rounded-t-3xl px-4 pt-3 pb-4",
						"xl:inset-x-auto xl:top-[72px] xl:right-6 xl:bottom-4 xl:max-h-none xl:w-[368px] xl:animate-none xl:rounded-3xl xl:px-5 xl:pt-3.5 xl:pb-5",
					)}
				>
					{detail}
				</div>
			)}
		</div>
	);
}

import type { IconVariant } from "@honeyicons/react";
import { catalog } from "@honeyicons/react/catalog";
import { Button } from "@honeyicons/ui/components/button";
import { Tabs, TabsContent } from "@honeyicons/ui/components/tabs";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useLenis } from "lenis/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	CATEGORY_DETAILS,
	type CategoryFilter,
	type IconsSearch,
	SIZE_DEFAULT,
	VARIANT_META,
} from "./constants";
import { IconGrid } from "./icon-grid";
import { IconSearch } from "./icon-search";
import { IconSidebar } from "./icon-sidebar";
import { IconToolbar } from "./icon-toolbar";

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
	const contentRef = useRef<HTMLDivElement>(null);
	const lenis = useLenis();
	const search = useSearch({ from: "/icons" });
	const navigate = useNavigate({ from: "/icons" });
	const [size, setSize] = useState(SIZE_DEFAULT);
	const [guides, setGuides] = useState(false);

	const query = search.q ?? "";
	const category: CategoryFilter = search.category ?? "all";
	const variant: IconVariant = search.style ?? "linear";

	function updateSearch(next: IconsSearch, replace = false) {
		void navigate({
			search: (prev) => ({ ...prev, ...next }),
			replace,
			resetScroll: false,
		});
	}

	function selectCategory(next: CategoryFilter) {
		updateSearch({ category: next === "all" ? undefined : next });
		// Return to the search and toolbar when switching from far down the page.
		const content = contentRef.current;
		if (content && content.getBoundingClientRect().top < 0) {
			lenis?.scrollTo(0);
		}
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
			}
		}
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

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

	const empty =
		needle && category !== "all" && matchesInAllCategories > 0
			? {
					title: `No matches in ${categoryLabel}`,
					description: `${matchesInAllCategories} ${matchesInAllCategories === 1 ? "icon matches" : "icons match"} “${query.trim()}” in other categories.`,
					action: (
						<Button onClick={() => selectCategory("all")}>
							Search all categories
						</Button>
					),
				}
			: needle
				? {
						title: "No icons match",
						description: `Nothing matches “${query.trim()}”. Try a shorter or more general word.`,
						action: (
							<Button
								variant="outline"
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
						title: "No icons here yet",
						description: `${categoryLabel} has no ${variant} icons yet.`,
						action: (
							<Button variant="outline" onClick={() => selectCategory("all")}>
								Show all categories
							</Button>
						),
					};

	return (
		<Tabs
			value={variant}
			onValueChange={(value) => {
				const next = VARIANT_META.find((item) => item.id === value)?.id;
				if (next) {
					updateSearch({ style: next === "linear" ? undefined : next });
				}
			}}
			className="grid items-start gap-6 [grid-template-areas:'header'_'sidebar'_'content'] sm:gap-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-10 lg:gap-y-8 lg:[grid-template-areas:'sidebar_header'_'sidebar_content'] xl:gap-x-12"
		>
			<div className="[grid-area:header]">
				<h1 className="sr-only">Icons</h1>
				<IconSearch
					value={query}
					onChange={(value) => updateSearch({ q: value || undefined }, true)}
					inputRef={inputRef}
				/>
			</div>

			<IconSidebar
				selected={category}
				onSelect={selectCategory}
				counts={counts}
			/>

			<div
				ref={contentRef}
				className="flex min-w-0 flex-col gap-6 [grid-area:content]"
			>
				<IconToolbar
					size={size}
					onSizeChange={setSize}
					guides={guides}
					onGuidesChange={setGuides}
					shown={items.length}
					total={variantItems.length}
				/>
				{/* One panel that follows the selected style. A panel per style would
				keep the previous one mounted during its exit and render the new
				style's icons with the old variant. */}
				<TabsContent value={variant}>
					<IconGrid
						items={items}
						variant={variant}
						size={size}
						guides={guides}
						empty={empty}
					/>
				</TabsContent>
			</div>
		</Tabs>
	);
}

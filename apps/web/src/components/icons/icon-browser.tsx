"use client";

import type { IconVariant } from "@honeyicons/react";
import { catalog } from "@honeyicons/react/catalog";
import { Tabs, TabsContent } from "@honeyicons/ui/components/tabs";
import { useEffect, useMemo, useRef, useState } from "react";
import { type CategoryFilter, SIZE_DEFAULT, VARIANT_META } from "./constants";
import { IconGrid } from "./icon-grid";
import { IconSearch } from "./icon-search";
import { IconSidebar } from "./icon-sidebar";
import { IconToolbar } from "./icon-toolbar";

export function IconBrowser() {
	const inputRef = useRef<HTMLInputElement>(null);
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState<CategoryFilter>("all");
	const [variant, setVariant] = useState<IconVariant>("linear");
	const [size, setSize] = useState(SIZE_DEFAULT);
	const [guides, setGuides] = useState(false);

	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				inputRef.current?.focus();
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

	const items = useMemo(() => {
		const needle = query.trim().toLowerCase();
		return variantItems.filter((item) => {
			if (category !== "all" && item.category !== category) {
				return false;
			}
			if (!needle) {
				return true;
			}
			return (
				item.name.includes(needle) ||
				item.pascalName.toLowerCase().includes(needle) ||
				item.tags.some((tag) => tag.toLowerCase().includes(needle))
			);
		});
	}, [category, query, variantItems]);

	return (
		<Tabs
			value={variant}
			onValueChange={(value) => {
				if (value === "linear" || value === "bold" || value === "duotone") {
					setVariant(value);
				}
			}}
			className="gap-10"
		>
			<div className="flex flex-col items-center gap-4 text-center">
				<h1 className="font-heading font-medium text-4xl tracking-tight sm:text-5xl">
					Browse {catalog.length > 0 ? `${catalog.length} ` : ""}icons
				</h1>
				<IconSearch value={query} onChange={setQuery} inputRef={inputRef} />
			</div>

			<div className="flex flex-col gap-8 lg:flex-row">
				<IconSidebar
					selected={category}
					onSelect={setCategory}
					counts={counts}
				/>
				<div className="flex min-w-0 flex-1 flex-col gap-6">
					<IconToolbar
						size={size}
						onSizeChange={setSize}
						guides={guides}
						onGuidesChange={setGuides}
						shown={items.length}
					/>
					{VARIANT_META.map((item) => (
						<TabsContent key={item.id} value={item.id}>
							<IconGrid
								items={items}
								variant={item.id}
								size={size}
								guides={guides}
								hasCatalog={catalog.length > 0}
								hasVariantIcons={variantItems.length > 0}
							/>
						</TabsContent>
					))}
				</div>
			</div>
		</Tabs>
	);
}

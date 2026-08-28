"use client";

import type { IconVariant } from "@honeyicons/react";
import { catalog } from "@honeyicons/react/catalog";
import { Tabs, TabsContent } from "@honeyicons/ui/components/tabs";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	type CategoryFilter,
	SIZE_DEFAULT,
	STROKE_DEFAULT,
	VARIANT_META,
} from "./constants";
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
	const [strokeWidth, setStrokeWidth] = useState(STROKE_DEFAULT);

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

	const counts = useMemo(() => {
		const next: Record<string, number> = { all: catalog.length };
		for (const item of catalog) {
			next[item.category] = (next[item.category] ?? 0) + 1;
		}
		return next;
	}, []);

	const items = useMemo(() => {
		const needle = query.trim().toLowerCase();
		return catalog.filter((item) => {
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
	}, [category, query]);

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
				<p className="text-muted-foreground">
					Linear, bold, and duotone on a 24 grid
				</p>
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
						variant={variant}
						size={size}
						onSizeChange={setSize}
						strokeWidth={strokeWidth}
						onStrokeWidthChange={setStrokeWidth}
						shown={items.length}
					/>
					{VARIANT_META.map((item) => (
						<TabsContent key={item.id} value={item.id}>
							<IconGrid
								items={items}
								variant={item.id}
								size={size}
								strokeWidth={strokeWidth}
								hasCatalog={catalog.length > 0}
							/>
						</TabsContent>
					))}
				</div>
			</div>
		</Tabs>
	);
}

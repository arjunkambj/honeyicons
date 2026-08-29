"use client";

import type { IconVariant } from "@honeyicons/react";
import type { CatalogItem } from "@honeyicons/react/catalog";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@honeyicons/ui/components/empty";
import { IconCard } from "./icon-card";

type IconGridProps = {
	items: CatalogItem[];
	variant: IconVariant;
	size: number;
	hasCatalog: boolean;
	hasVariantIcons: boolean;
};

export function IconGrid({
	items,
	variant,
	size,
	hasCatalog,
	hasVariantIcons,
}: IconGridProps) {
	if (items.length === 0) {
		const title = !hasCatalog
			? "No icons yet"
			: hasVariantIcons
				? "No icons match"
				: "No icons in this style yet";
		const description = !hasCatalog
			? "Add SVGs under icons/linear/{category}, then run bun run generate:icons."
			: hasVariantIcons
				? "Try another search or category."
				: `Add SVGs under icons/${variant}/{category}, then run bun run generate:icons.`;
		return (
			<Empty className="min-h-64 border border-dashed">
				<EmptyHeader>
					<EmptyTitle>{title}</EmptyTitle>
					<EmptyDescription>{description}</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	return (
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
			{items.map((item) => (
				<IconCard key={item.name} item={item} variant={variant} size={size} />
			))}
		</div>
	);
}

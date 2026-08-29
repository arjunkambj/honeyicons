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
	strokeWidth: number;
	hasCatalog: boolean;
};

export function IconGrid({
	items,
	variant,
	size,
	strokeWidth,
	hasCatalog,
}: IconGridProps) {
	if (items.length === 0) {
		return (
			<Empty className="min-h-64 border border-dashed">
				<EmptyHeader>
					<EmptyTitle>
						{hasCatalog ? "No icons match" : "No icons yet"}
					</EmptyTitle>
					<EmptyDescription>
						{hasCatalog
							? "Try another search or category."
							: "Add SVGs under icons/linear/{category}, then run bun run generate:icons."}
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	return (
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
			{items.map((item) => (
				<IconCard
					key={item.name}
					item={item}
					variant={variant}
					size={size}
					strokeWidth={strokeWidth}
				/>
			))}
		</div>
	);
}

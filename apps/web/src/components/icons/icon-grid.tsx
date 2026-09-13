import type { IconVariant } from "@honeyicons/react";
import type { CatalogItem } from "@honeyicons/react/catalog";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@honeyicons/ui/components/empty";
import { TooltipProvider } from "@honeyicons/ui/components/tooltip";
import { IconCard } from "./icon-card";

type IconGridProps = {
	items: CatalogItem[];
	variant: IconVariant;
	size: number;
	guides: boolean;
	hasCatalog: boolean;
	hasVariantIcons: boolean;
};

export function IconGrid({
	items,
	variant,
	size,
	guides,
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
		<TooltipProvider delay={300}>
			<div className="overflow-x-auto">
				<div
					className="grid gap-1 [--icon-cell-min:72px] sm:[--icon-cell-min:64px]"
					style={{
						gridTemplateColumns: `repeat(auto-fill, minmax(max(${guides ? "176px" : "var(--icon-cell-min)"}, ${size + 24}px), 1fr))`,
						minWidth: size + 24,
					}}
				>
					{items.map((item) => (
						<IconCard
							key={item.name}
							item={item}
							variant={variant}
							size={size}
							guides={guides}
						/>
					))}
				</div>
			</div>
		</TooltipProvider>
	);
}

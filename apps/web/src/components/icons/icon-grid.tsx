import type { IconVariant } from "@honeyicons/react";
import type { CatalogItem } from "@honeyicons/react/catalog";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@honeyicons/ui/components/empty";
import { TooltipProvider } from "@honeyicons/ui/components/tooltip";
import type { ReactNode } from "react";
import { IconCard } from "./icon-card";

type IconGridProps = {
	items: CatalogItem[];
	variant: IconVariant;
	size: number;
	guides: boolean;
	empty: { title: string; description: string; action?: ReactNode };
};

export function IconGrid({
	items,
	variant,
	size,
	guides,
	empty,
}: IconGridProps) {
	if (items.length === 0) {
		return (
			<Empty className="min-h-64 border border-dashed">
				<EmptyHeader>
					<EmptyTitle>{empty.title}</EmptyTitle>
					<EmptyDescription>{empty.description}</EmptyDescription>
				</EmptyHeader>
				{empty.action && <EmptyContent>{empty.action}</EmptyContent>}
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
							// A style switch remounts the card so guides measure the new artwork.
							key={`${variant}:${item.name}`}
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

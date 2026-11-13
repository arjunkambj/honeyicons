import type { IconVariant } from "@honeyicons/react";
import type { CatalogItem } from "@honeyicons/react/catalog";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@honeyicons/ui/components/empty";
import { cn } from "@honeyicons/ui/lib/utils";
import {
	type KeyboardEvent,
	type ReactNode,
	useCallback,
	useState,
} from "react";

type IconBounds = { x: number; y: number; width: number; height: number };

function measureBounds(svg: SVGSVGElement): IconBounds {
	// Animated icons can mark a stationary shape for stable bounds.
	const shape =
		svg.querySelector<SVGGraphicsElement>("[data-honeyicons-bounds]") ?? svg;
	const { x, y, width, height } = shape.getBBox();
	// Include round strokes so stroked and filled icons compare fairly.
	const stroke = Number(svg.getAttribute("stroke-width") ?? 0);
	return {
		x: x - stroke / 2,
		y: y - stroke / 2,
		width: width + stroke,
		height: height + stroke,
	};
}

function GuideOverlay({
	bounds,
	scale,
}: {
	bounds: IconBounds | null;
	scale: number;
}) {
	return (
		<span aria-hidden="true" className="pointer-events-none absolute inset-0">
			<span className="absolute inset-0 bg-muted/60" />
			<span className="absolute inset-y-0 left-1/2 border-border border-l" />
			<span className="absolute inset-x-0 top-1/2 border-border border-t" />
			{bounds && (
				<span
					className="absolute border border-foreground/50 border-dashed"
					style={{
						left: bounds.x * scale,
						top: bounds.y * scale,
						width: bounds.width * scale,
						height: bounds.height * scale,
					}}
				/>
			)}
		</span>
	);
}

function IconCell({
	item,
	variant,
	size,
	guides,
	selected,
	onSelect,
}: {
	item: CatalogItem;
	variant: IconVariant;
	size: number;
	guides: boolean;
	selected: boolean;
	onSelect: () => void;
}) {
	const Component = item.component;
	const [bounds, setBounds] = useState<IconBounds | null>(null);
	const scale = size / 24;
	// Measure when the drawing mounts with guides on, or when guides turn on.
	const measureRef = useCallback(
		(svg: SVGSVGElement | null) => {
			if (guides && svg) setBounds(measureBounds(svg));
		},
		[guides],
	);

	return (
		<button
			type="button"
			data-icon-cell={item.name}
			aria-pressed={selected}
			aria-label={item.name}
			onClick={onSelect}
			className={cn(
				"group relative flex aspect-square min-w-0 items-center justify-center border-border border-r border-b outline-none transition-colors",
				"hover:bg-card focus-visible:z-10 focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
				selected && "bg-card",
			)}
		>
			<span className="relative block" style={{ width: size, height: size }}>
				{guides && <GuideOverlay bounds={bounds} scale={scale} />}
				<Component
					ref={measureRef}
					variant={variant}
					size={size}
					className="relative block"
				/>
			</span>
			<span
				className={cn(
					"absolute inset-x-1 bottom-1 truncate text-center text-caption text-muted-foreground transition-opacity",
					guides || selected
						? "opacity-100"
						: "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
					guides && "font-mono tabular-nums",
				)}
			>
				{!guides
					? item.name
					: bounds
						? `${(bounds.height * scale).toFixed(1)} × ${(bounds.width * scale).toFixed(1)}`
						: "—"}
			</span>
		</button>
	);
}

/** Moves focus between cells with the arrow keys, row by row. */
function moveFocus(event: KeyboardEvent<HTMLDivElement>) {
	const keys = [
		"ArrowLeft",
		"ArrowRight",
		"ArrowUp",
		"ArrowDown",
		"Home",
		"End",
	];
	if (!keys.includes(event.key)) return;
	const cells = Array.from(
		event.currentTarget.querySelectorAll<HTMLButtonElement>("[data-icon-cell]"),
	);
	const index = cells.indexOf(document.activeElement as HTMLButtonElement);
	if (index === -1) return;
	const top = cells[0]?.offsetTop;
	const firstWrap = cells.findIndex((cell) => cell.offsetTop !== top);
	const perRow = firstWrap === -1 ? cells.length : firstWrap;
	const target = {
		ArrowLeft: index - 1,
		ArrowRight: index + 1,
		ArrowUp: index - perRow,
		ArrowDown: index + perRow,
		Home: 0,
		End: cells.length - 1,
	}[event.key];
	const cell = target === undefined ? undefined : cells[target];
	if (!cell) return;
	event.preventDefault();
	cell.focus();
	cell.click();
	cell.scrollIntoView({ block: "nearest" });
}

export function IconGrid({
	items,
	variant,
	size,
	guides,
	selected,
	onSelect,
	empty,
}: {
	items: CatalogItem[];
	variant: IconVariant;
	size: number;
	guides: boolean;
	selected: string | undefined;
	onSelect: (name: string) => void;
	empty: { title: string; description: string; action?: ReactNode };
}) {
	if (items.length === 0) {
		return (
			<Empty className="surface min-h-72">
				<EmptyHeader>
					<EmptyTitle>{empty.title}</EmptyTitle>
					<EmptyDescription>{empty.description}</EmptyDescription>
				</EmptyHeader>
				{empty.action && <EmptyContent>{empty.action}</EmptyContent>}
			</Empty>
		);
	}

	return (
		<div
			role="group"
			aria-label="Icons"
			onKeyDown={moveFocus}
			className="grid border-border border-t border-l"
			style={{
				gridTemplateColumns: `repeat(auto-fill, minmax(${guides ? Math.max(124, size + 40) : Math.max(92, size + 32)}px, 1fr))`,
			}}
		>
			{items.map((item) => (
				<IconCell
					// A style switch remounts the cell so guides measure the new drawing.
					key={`${variant}:${item.name}`}
					item={item}
					variant={variant}
					size={size}
					guides={guides}
					selected={selected === item.name}
					onSelect={() => onSelect(item.name)}
				/>
			))}
		</div>
	);
}

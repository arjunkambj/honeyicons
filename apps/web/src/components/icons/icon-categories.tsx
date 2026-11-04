import { cn } from "@honeyicons/ui/lib/utils";
import { useEffect, useRef } from "react";
import { CATEGORY_META, type CategoryFilter } from "./constants";

type CategoryProps = {
	selected: CategoryFilter;
	onSelect: (category: CategoryFilter) => void;
	counts: Record<string, number>;
};

function visibleCategories(
	selected: CategoryFilter,
	counts: Record<string, number>,
) {
	return CATEGORY_META.filter(
		(category) => (counts[category.id] ?? 0) > 0 || category.id === selected,
	);
}

/** The desktop rail: one category per row with its count. */
export function CategoryRail({ selected, onSelect, counts }: CategoryProps) {
	return (
		<nav aria-label="Icon categories" className="flex flex-col gap-1">
			<p className="mb-1 px-2.5 font-medium text-[13px] text-foreground">
				Categories
			</p>
			{visibleCategories(selected, counts).map((category) => {
				const active = selected === category.id;
				return (
					<button
						key={category.id}
						type="button"
						aria-pressed={active}
						onClick={() => onSelect(category.id)}
						className={cn(
							"flex h-7 w-full items-center gap-2.5 rounded-xl px-2.5 text-sm transition-colors",
							active
								? "bg-card font-medium text-foreground shadow-xxs dark:bg-muted"
								: "text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
						)}
					>
						<category.icon size={16} />
						<span className="truncate">{category.label}</span>
						<span className="ml-auto font-mono text-[11px] tabular-nums opacity-70">
							{counts[category.id] ?? 0}
						</span>
					</button>
				);
			})}
		</nav>
	);
}

/** The phone and tablet version: a swipeable row of chips. */
export function CategoryChips({ selected, onSelect, counts }: CategoryProps) {
	const rowRef = useRef<HTMLElement>(null);

	// Keep the selected chip in view.
	useEffect(() => {
		const row = rowRef.current;
		const chip = row?.querySelector<HTMLElement>(
			`[data-category="${selected}"]`,
		);
		if (!row || !chip || row.scrollWidth <= row.clientWidth) return;
		const offset =
			chip.getBoundingClientRect().left - row.getBoundingClientRect().left;
		row.scrollTo({
			left: row.scrollLeft + offset - (row.clientWidth - chip.offsetWidth) / 2,
			behavior: "smooth",
		});
	}, [selected]);

	return (
		<nav
			ref={rowRef}
			aria-label="Icon categories"
			className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 sm:-mx-6 sm:px-6"
		>
			{visibleCategories(selected, counts).map((category) => {
				const active = selected === category.id;
				return (
					<button
						key={category.id}
						type="button"
						data-category={category.id}
						aria-pressed={active}
						onClick={() => onSelect(category.id)}
						className={cn(
							"flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm transition-colors",
							active
								? "border-transparent bg-foreground text-background"
								: "border-border text-muted-foreground hover:text-foreground",
						)}
					>
						<category.icon size={14} />
						{category.label}
					</button>
				);
			})}
		</nav>
	);
}

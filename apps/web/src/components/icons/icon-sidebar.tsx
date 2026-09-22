import { cn } from "@honeyicons/ui/lib/utils";
import { useEffect, useRef } from "react";
import {
	SidebarHeading,
	sidebarClass,
	sidebarLinkClass,
} from "@/components/sidebar-nav";
import { CATEGORY_META, type CategoryFilter } from "./constants";

type IconSidebarProps = {
	selected: CategoryFilter;
	onSelect: (category: CategoryFilter) => void;
	counts: Record<string, number>;
};

export function IconSidebar({ selected, onSelect, counts }: IconSidebarProps) {
	const navRef = useRef<HTMLElement>(null);

	// Center the selected chip when the categories scroll sideways on mobile.
	useEffect(() => {
		const nav = navRef.current;
		const active = nav?.querySelector<HTMLElement>(
			`[data-category="${selected}"]`,
		);
		if (!nav || !active || nav.scrollWidth <= nav.clientWidth) return;
		const offset =
			active.getBoundingClientRect().left - nav.getBoundingClientRect().left;
		nav.scrollTo({
			left:
				nav.scrollLeft + offset - (nav.clientWidth - active.offsetWidth) / 2,
			behavior: "smooth",
		});
	}, [selected]);

	return (
		<aside className={cn(sidebarClass, "w-full [grid-area:sidebar]")}>
			<SidebarHeading>Categories</SidebarHeading>
			{/* A swipeable row on small screens; a list in the desktop rail. */}
			<nav
				ref={navRef}
				aria-label="Icon categories"
				className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-10 sm:px-10 lg:mx-0 lg:grid lg:grid-cols-1 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
			>
				{CATEGORY_META.map((category) => {
					const count = counts[category.id] ?? 0;
					const isActive = selected === category.id;
					if (count === 0 && !isActive) {
						return null;
					}
					return (
						<button
							key={category.id}
							type="button"
							data-category={category.id}
							aria-pressed={isActive}
							onClick={() => onSelect(category.id)}
							className={cn(
								sidebarLinkClass(isActive),
								"w-auto shrink-0 justify-between gap-3 max-lg:border max-lg:border-border lg:w-full",
								isActive && "max-lg:border-transparent",
							)}
						>
							<span className="flex min-w-0 items-center gap-2">
								<category.icon size={16} />
								<span className="truncate">{category.label}</span>
							</span>
							<span className="text-muted-foreground tabular-nums">
								{count}
							</span>
						</button>
					);
				})}
			</nav>
		</aside>
	);
}

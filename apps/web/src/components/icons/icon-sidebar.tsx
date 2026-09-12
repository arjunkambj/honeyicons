import { Button } from "@honeyicons/ui/components/button";
import { cn } from "@honeyicons/ui/lib/utils";
import { CATEGORY_META, type CategoryFilter } from "./constants";

type IconSidebarProps = {
	selected: CategoryFilter;
	onSelect: (category: CategoryFilter) => void;
	counts: Record<string, number>;
};

export function IconSidebar({ selected, onSelect, counts }: IconSidebarProps) {
	return (
		<aside className="w-full shrink-0 lg:w-52">
			<p className="mb-3 flex h-9 items-center px-2 font-medium text-muted-foreground text-xs tracking-wider">
				Categories
			</p>
			<nav className="flex flex-col gap-0.5">
				{CATEGORY_META.map((category) => {
					const count = counts[category.id] ?? 0;
					const isActive = selected === category.id;
					return (
						<Button
							key={category.id}
							type="button"
							variant="ghost"
							size="sm"
							aria-pressed={isActive}
							onClick={() => onSelect(category.id)}
							className={cn(
								"w-full justify-between px-2 font-normal",
								isActive && "bg-muted text-foreground",
							)}
						>
							<span className="flex min-w-0 items-center gap-2">
								<category.icon />
								<span className="truncate">{category.label}</span>
							</span>
							<span className="text-muted-foreground tabular-nums">
								{count}
							</span>
						</Button>
					);
				})}
			</nav>
		</aside>
	);
}

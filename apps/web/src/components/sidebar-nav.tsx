import { cn } from "@honeyicons/ui/lib/utils";
import type { ReactNode } from "react";

/** Sticky left rail shared by the docs, changelog, and icon catalog. */
export const sidebarClass =
	"min-w-0 lg:sticky lg:top-26 lg:max-h-[calc(100svh-7.5rem)] lg:self-start lg:overflow-y-auto lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden";

export function sidebarLinkClass(selected: boolean) {
	return cn(
		"flex h-8 w-full items-center gap-2 rounded-4xl px-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
		selected
			? "bg-muted text-foreground"
			: "text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
	);
}

export function SidebarHeading({
	className,
	children,
}: {
	className?: string;
	children: ReactNode;
}) {
	return (
		<p
			className={cn(
				"mb-2 px-2 font-medium text-muted-foreground text-xs tracking-wider",
				className,
			)}
		>
			{children}
		</p>
	);
}

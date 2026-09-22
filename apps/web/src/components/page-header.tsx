import { cn } from "@honeyicons/ui/lib/utils";
import type { ReactNode } from "react";

/** Eyebrow, title, and lead shared by every non-marketing page. */
export function PageHeader({
	id,
	eyebrow,
	title,
	description,
	className,
	children,
}: {
	id?: string;
	eyebrow: ReactNode;
	title: ReactNode;
	description?: ReactNode;
	className?: string;
	children?: ReactNode;
}) {
	return (
		<header id={id} className={cn("scroll-mt-24", className)}>
			<p className="mb-3 text-muted-foreground text-sm">{eyebrow}</p>
			<h1 className="font-heading font-medium text-4xl leading-tight tracking-tight sm:text-5xl">
				{title}
			</h1>
			{description && (
				<p className="mt-4 max-w-xl text-muted-foreground leading-7">
					{description}
				</p>
			)}
			{children}
		</header>
	);
}

/** Row of buttons that follows a page header or section. */
export function PageActions({ children }: { children: ReactNode }) {
	return <div className="mt-8 flex flex-wrap gap-3">{children}</div>;
}

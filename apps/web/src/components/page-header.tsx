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
		<header id={id} className={cn("scroll-mt-36 xl:scroll-mt-24", className)}>
			<p className="mb-3 text-label text-muted-foreground">{eyebrow}</p>
			<h1 className="text-balance font-medium text-title lg:text-display">
				{title}
			</h1>
			{description && (
				<p className="mt-6 max-w-xl text-body text-muted-foreground lg:text-lead">
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

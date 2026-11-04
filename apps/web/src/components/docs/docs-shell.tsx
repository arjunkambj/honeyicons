import { Icon, SidebarLeft } from "@honeyicons/react";
import { cn } from "@honeyicons/ui/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import { type DocsNavItem, docsNav, docsPages } from "./docs-nav";

function navItemClass(selected: boolean) {
	return cn(
		"flex h-8 w-full items-center gap-2.5 rounded-xl px-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-ring",
		selected
			? "bg-card font-medium text-foreground shadow-xxs dark:bg-muted"
			: "text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
	);
}

function NavItem({ item, pathname }: { item: DocsNavItem; pathname: string }) {
	const content = (
		<>
			<Icon icon={item.icon} size={16} className="shrink-0" />
			<span className="truncate">{item.label}</span>
		</>
	);
	if (item.to === undefined) {
		return (
			<a href={item.href} className={navItemClass(false)}>
				{content}
			</a>
		);
	}
	const selected = pathname === item.to;
	return (
		<Link
			to={item.to}
			aria-current={selected ? "page" : undefined}
			className={navItemClass(selected)}
		>
			{content}
		</Link>
	);
}

function DocsNavList({ pathname }: { pathname: string }) {
	return (
		<nav aria-label="Documentation" className="flex flex-col gap-6">
			{docsNav.map((group) => (
				<div key={group.title}>
					<p className="mb-1 px-2.5 font-medium text-[13px] text-foreground">
						{group.title}
					</p>
					<ul className="flex flex-col gap-0.5">
						{group.items.map((item) => (
							<li key={item.label}>
								<NavItem item={item} pathname={pathname} />
							</li>
						))}
					</ul>
				</div>
			))}
		</nav>
	);
}

/** Left navigation for the docs and the changelog. Pages bring their own table of contents. */
export function DocsShell({ children }: { children: ReactNode }) {
	const pathname = useLocation({ select: (location) => location.pathname });
	const [menuOpen, setMenuOpen] = useState(false);
	const [lastPath, setLastPath] = useState(pathname);
	// Close the phone menu whenever a link inside it changes the page.
	if (pathname !== lastPath) {
		setLastPath(pathname);
		setMenuOpen(false);
	}
	const current = docsPages.find((page) => page.to === pathname);

	return (
		<div className="page-gutter grid flex-1 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
			<aside className="no-scrollbar sticky top-14 hidden h-[calc(100svh-3.5rem)] -mx-1.5 overflow-y-auto px-1.5 py-8 lg:block">
				<DocsNavList pathname={pathname} />
			</aside>

			<div className="min-w-0">
				<div className="sticky top-14 z-30 -mx-4 border-border border-b bg-background/90 backdrop-blur-xl sm:-mx-6 lg:hidden">
					<button
						type="button"
						aria-expanded={menuOpen}
						aria-controls="docs-menu"
						onClick={() => setMenuOpen((open) => !open)}
						className="flex h-11 w-full items-center gap-2 px-4 text-sm sm:px-6"
					>
						<SidebarLeft size={16} className="text-muted-foreground" />
						{current ? (
							<>
								<span className="text-muted-foreground">{current.group}</span>
								<span className="text-muted-foreground">/</span>
								<span className="font-medium">{current.label}</span>
							</>
						) : (
							"Menu"
						)}
					</button>
					{menuOpen && (
						<div
							id="docs-menu"
							className="max-h-[70svh] overflow-y-auto border-border border-t px-2 py-4 sm:px-4"
						>
							<DocsNavList pathname={pathname} />
						</div>
					)}
				</div>
				{children}
			</div>
		</div>
	);
}

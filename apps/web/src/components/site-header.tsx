import { Github } from "@honeyicons/react";
import { cn } from "@honeyicons/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { BrandLogo } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";

export const GITHUB_URL = "https://github.com/arjunkambj/honeyicons";

export const navLinks = [
	{ to: "/icons", label: "Icons" },
	{ to: "/docs", label: "Docs" },
	{ to: "/changelog", label: "Changelog" },
] as const;

/** Top bar for every page except home, which keeps its links beside the stage. */
export function SiteHeader() {
	return (
		<header className="sticky top-0 z-40 h-16 border-border border-b bg-background/85 backdrop-blur-xl">
			<div className="page-gutter flex h-full items-center gap-4">
				<Link
					to="/"
					aria-label="Honeyicons home"
					className="flex shrink-0 items-center text-foreground"
				>
					<BrandLogo className="h-5 w-[124px]" />
				</Link>
				<nav
					aria-label="Main navigation"
					className="flex min-w-0 items-center text-label"
				>
					{navLinks.map(({ to, label }) => (
						<Link
							key={to}
							to={to}
							className={cn(
								"rounded-full px-3 py-2 text-muted-foreground transition-colors hover:text-foreground",
								to === "/changelog" && "hidden sm:block",
							)}
							activeProps={{ className: "text-foreground" }}
						>
							{label}
						</Link>
					))}
				</nav>
				<div className="ml-auto flex items-center gap-2">
					<div className="hidden sm:block">
						<ThemeToggle />
					</div>
					<a
						href={GITHUB_URL}
						target="_blank"
						rel="noreferrer"
						aria-label="Honeyicons on GitHub"
						className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
					>
						<Github size={20} />
					</a>
				</div>
			</div>
		</header>
	);
}

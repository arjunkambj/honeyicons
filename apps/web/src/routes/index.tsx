import { ArrowRight, Github } from "@honeyicons/react";
import { catalog } from "@honeyicons/react/catalog";
import { Button } from "@honeyicons/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BrandLogo } from "@/components/brand-mark";
import { IconStage } from "@/components/home/icon-stage";
import { AgentSetup, QuickInstall } from "@/components/install-command";
import { GITHUB_URL, navLinks } from "@/components/site-header";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: "Honeyicons · React icons in linear and bold" },
			{
				name: "description",
				content: `${catalog.length} matching icons, each with an outline and a filled version. Free for personal and commercial work.`,
			},
		],
	}),
	component: Home,
});

// One gutter for the header, the hero and the footer, so they share a left edge.
const gutter = "px-4 sm:px-8 xl:px-16";

function Home() {
	return (
		<main className="flex min-h-dvh flex-col bg-background lg:grid lg:h-dvh lg:grid-cols-2 lg:grid-rows-[auto_1fr_auto]">
			<header
				className={`flex h-16 items-center gap-4 lg:col-start-1 lg:row-start-1 ${gutter}`}
			>
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
							className={`rounded-full px-3 py-2 text-muted-foreground transition-colors hover:text-foreground ${
								to === "/changelog" ? "hidden sm:block" : ""
							}`}
						>
							{label}
						</Link>
					))}
				</nav>
				<a
					href={GITHUB_URL}
					target="_blank"
					rel="noreferrer"
					aria-label="Honeyicons on GitHub"
					className="ml-auto flex size-8 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
				>
					<Github size={20} />
				</a>
			</header>

			<section
				className={`flex flex-col justify-center py-12 lg:col-start-1 lg:row-start-2 ${gutter}`}
			>
				<h1 className="max-w-lg text-balance font-medium text-title lg:text-display">
					{catalog.length} React icons that all match
				</h1>
				<p className="mt-6 max-w-md text-body text-muted-foreground lg:text-lead">
					They're drawn on one grid with one line weight, and each has an
					outline and a filled version. Download any of them, or drop them
					straight into your app.
				</p>
				<div className="mt-8 flex flex-wrap items-center gap-3">
					<Button
						size="lg"
						className="h-10 px-6"
						nativeButton={false}
						render={<Link to="/icons" />}
					>
						Browse icons
						<ArrowRight data-icon="inline-end" />
					</Button>
					<QuickInstall />
				</div>
				<div className="mt-4">
					<AgentSetup />
				</div>
			</section>

			<IconStage className="flex-1 border-border border-t lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:border-t-0 lg:border-l" />

			<footer
				className={`flex min-h-16 items-center gap-6 py-4 lg:col-start-1 lg:row-start-3 ${gutter}`}
			>
				<p className="min-w-0 flex-1 text-caption text-muted-foreground">
					Free and MIT licensed. Typed icon names. Drawn for 16, 20 and 24 px.
				</p>
				<ThemeToggle />
			</footer>
		</main>
	);
}

import { ArrowRight, Github } from "@honeyicons/react";
import { catalog } from "@honeyicons/react/catalog";
import { Button } from "@honeyicons/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BrandLogo } from "@/components/brand-mark";
import { IconStage } from "@/components/home/icon-stage";
import { InstallCommand } from "@/components/install-command";
import { GITHUB_URL } from "@/components/site-header";
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

const navLinks = [
	{ to: "/icons", label: "Icons" },
	{ to: "/docs", label: "Docs" },
	{ to: "/changelog", label: "Changelog" },
] as const;

function Home() {
	return (
		<main className="relative flex min-h-dvh flex-col overflow-hidden bg-background lg:h-dvh">
			<section className="relative z-10 flex flex-col px-6 sm:px-12 lg:h-full lg:w-[44%] lg:min-w-[460px] lg:px-14">
				<header className="flex h-16 shrink-0 items-center gap-1 text-sm lg:h-20">
					<nav aria-label="Main navigation" className="-ml-3 flex items-center">
						{navLinks.map(({ to, label }) => (
							<Link
								key={to}
								to={to}
								className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
							>
								{label}
							</Link>
						))}
					</nav>
					<div className="ml-auto flex items-center gap-1">
						<ThemeToggle />
						<a
							href={GITHUB_URL}
							target="_blank"
							rel="noreferrer"
							aria-label="Honeyicons on GitHub"
							className="flex size-8 items-center justify-center text-foreground/80 transition-colors hover:text-foreground"
						>
							<Github size={20} />
						</a>
					</div>
				</header>

				<div className="flex flex-1 flex-col justify-center py-10 lg:pb-20">
					<h1>
						<BrandLogo className="h-9 w-[222px] text-foreground" />
						<span className="sr-only">Honeyicons</span>
					</h1>
					<p className="mt-4 max-w-[420px] text-[15px] text-muted-foreground leading-6.5">
						{catalog.length} icons that all match, each with an outline and a
						filled version. Download any of them, or drop them straight into
						your app. Free for personal and commercial work.
					</p>
					<div className="mt-7 flex flex-wrap items-center gap-2">
						<Button
							size="lg"
							nativeButton={false}
							render={<Link to="/icons" />}
						>
							Browse icons
							<ArrowRight data-icon="inline-end" />
						</Button>
						<Button
							size="lg"
							variant="secondary"
							nativeButton={false}
							render={<a href={GITHUB_URL} target="_blank" rel="noreferrer" />}
						>
							<Github data-icon="inline-start" />
							Star on GitHub
						</Button>
					</div>
					<InstallCommand agentPrompt className="mt-4 max-w-[440px]" />
				</div>
			</section>

			<div className="relative h-[56dvh] w-full border-border border-t lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[56%] lg:border-t-0 lg:border-l">
				<IconStage className="absolute inset-0" />
				<div
					aria-hidden
					className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 bg-linear-to-r from-background lg:block"
				/>
			</div>
		</main>
	);
}

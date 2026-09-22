import {
	Clock,
	Code,
	File,
	Layers,
	Menu,
	Sparkles,
	Widget,
} from "@honeyicons/react";
import { cn } from "@honeyicons/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";
import {
	SidebarHeading,
	sidebarClass,
	sidebarLinkClass,
} from "@/components/sidebar-nav";

export type PageSection = { id: string; label: string };

const overviewLinks = [
	{ label: "Introduction", hash: "introduction", Icon: File },
	{ label: "Quick start", hash: "install", Icon: Code },
	{ label: "Props", hash: "props", Icon: Layers },
	{ label: "Agent skill", hash: "agent-skill", Icon: Sparkles },
] as const;

export function DocumentationLayout({
	page,
	sections,
	children,
}: {
	page: "docs" | "changelog";
	sections: readonly PageSection[];
	children: ReactNode;
}) {
	const [active, setActive] = useState(sections[0]?.id ?? "");

	useEffect(() => {
		let frame = 0;
		function update() {
			const offset = 96;
			let current = sections[0]?.id ?? "";
			for (const section of sections) {
				const element = document.getElementById(section.id);
				if (element && element.getBoundingClientRect().top <= offset) {
					current = section.id;
				}
			}
			if (
				window.scrollY > 0 &&
				window.innerHeight + window.scrollY >=
					document.documentElement.scrollHeight - 2
			) {
				current = sections.at(-1)?.id ?? current;
			}
			setActive(current);
		}
		function scheduleUpdate() {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(update);
		}
		update();
		window.addEventListener("scroll", scheduleUpdate, { passive: true });
		window.addEventListener("resize", scheduleUpdate);
		window.addEventListener("hashchange", scheduleUpdate);
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener("scroll", scheduleUpdate);
			window.removeEventListener("resize", scheduleUpdate);
			window.removeEventListener("hashchange", scheduleUpdate);
		};
	}, [sections]);

	return (
		<div className="page-shell grid items-start gap-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[200px_minmax(0,1fr)_180px] xl:gap-12">
			<aside className={sidebarClass}>
				<nav aria-label="Documentation navigation">
					<SidebarHeading>Overview</SidebarHeading>
					<ul className="flex flex-wrap gap-1 lg:flex-col">
						{overviewLinks.map(({ label, hash, Icon }) => {
							const selected =
								page === "docs" &&
								(active === hash || (hash === "install" && active === "usage"));
							return (
								<li key={hash}>
									<Link
										to="/docs"
										hash={hash}
										aria-current={selected ? "location" : undefined}
										className={sidebarLinkClass(selected)}
									>
										<Icon size={16} />
										<span>{label}</span>
									</Link>
								</li>
							);
						})}
					</ul>
					<SidebarHeading className="mt-6">Resources</SidebarHeading>
					<ul className="flex flex-wrap gap-1 lg:flex-col">
						<li>
							<Link to="/icons" className={sidebarLinkClass(false)}>
								<Widget size={16} />
								<span>Icon catalog</span>
							</Link>
						</li>
						<li>
							<Link
								to="/changelog"
								aria-current={page === "changelog" ? "page" : undefined}
								className={sidebarLinkClass(page === "changelog")}
							>
								<Clock size={16} />
								<span>Changelog</span>
							</Link>
						</li>
					</ul>
				</nav>
			</aside>
			<main className="min-w-0">
				<nav
					aria-label="On this page"
					className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border pb-4 text-sm xl:hidden"
				>
					<span className="flex items-center gap-2 text-muted-foreground">
						<Menu size={16} />
						On this page
					</span>
					{sections.map(({ id, label }) => (
						<a
							key={id}
							href={`#${id}`}
							aria-current={active === id ? "location" : undefined}
							className={cn(
								"py-1 underline-offset-4 hover:underline",
								active === id ? "text-foreground" : "text-muted-foreground",
							)}
							onClick={() => setActive(id)}
						>
							{label}
						</a>
					))}
				</nav>
				{children}
			</main>
			<aside className={cn(sidebarClass, "hidden xl:block")}>
				<nav aria-label="On this page">
					<SidebarHeading className="flex items-center gap-2 px-0">
						<Menu size={16} />
						On this page
					</SidebarHeading>
					<ul className="flex flex-col gap-1 border-border border-l">
						{sections.map(({ id, label }) => (
							<li key={id}>
								<a
									href={`#${id}`}
									aria-current={active === id ? "location" : undefined}
									onClick={() => setActive(id)}
									className={cn(
										"-ml-px flex h-8 items-center border-l pl-4 text-sm transition-colors",
										active === id
											? "border-foreground text-foreground"
											: "border-transparent text-muted-foreground hover:text-foreground",
									)}
								>
									{label}
								</a>
							</li>
						))}
					</ul>
				</nav>
			</aside>
		</div>
	);
}

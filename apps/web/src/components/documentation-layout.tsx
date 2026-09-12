import {
	AlignLeft,
	Clock,
	Code,
	File,
	Layers,
	Widget,
} from "@honeyicons/react";
import { cn } from "@honeyicons/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";

export type PageSection = { id: string; label: string };

const overviewLinks = [
	{ label: "Introduction", hash: "introduction", Icon: File },
	{ label: "Quick start", hash: "install", Icon: Code },
	{ label: "Design principles", hash: "props", Icon: Layers },
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
			const offset = window.matchMedia("(min-width: 640px)").matches
				? 128
				: 160;
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

	const linkClass =
		"flex items-center gap-3 rounded-xl px-2 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2";
	const selectedClass = "bg-muted text-foreground";
	const inactiveClass =
		"text-muted-foreground hover:bg-muted/60 hover:text-foreground";

	return (
		<div className="container mx-auto grid items-start gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[200px_minmax(0,1fr)_180px] xl:gap-12">
			<aside>
				<nav
					aria-label="Documentation navigation"
					className="lg:fixed lg:top-32 lg:bottom-8 lg:w-[200px] lg:overflow-y-auto"
				>
					<p className="mb-2 px-2 font-medium text-sm">Overview</p>
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
										className={cn(
											linkClass,
											selected ? selectedClass : inactiveClass,
										)}
									>
										<Icon size={16} />
										<span>{label}</span>
									</Link>
								</li>
							);
						})}
					</ul>
					<p className="mt-6 mb-2 px-2 font-medium text-sm">Resources</p>
					<ul className="flex flex-wrap gap-1 lg:flex-col">
						<li>
							<Link to="/icons" className={cn(linkClass, inactiveClass)}>
								<Widget size={16} />
								<span>Icon catalog</span>
							</Link>
						</li>
						<li>
							<Link
								to="/changelog"
								aria-current={page === "changelog" ? "page" : undefined}
								className={cn(
									linkClass,
									page === "changelog" ? selectedClass : inactiveClass,
								)}
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
						<AlignLeft size={16} />
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
			<aside className="hidden xl:block">
				<nav
					aria-label="On this page"
					className="fixed top-32 bottom-8 w-[180px] overflow-y-auto"
				>
					<p className="mb-4 flex items-center gap-2 text-muted-foreground text-sm">
						<AlignLeft size={18} />
						On this page
					</p>
					<ul className="flex flex-col gap-1">
						{sections.map(({ id, label }) => (
							<li key={id}>
								<a
									href={`#${id}`}
									aria-current={active === id ? "location" : undefined}
									onClick={() => setActive(id)}
									className={cn(
										"block border-l py-2 pl-4 text-sm transition-colors",
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

import { ArrowLeft, ArrowRight, Github } from "@honeyicons/react";
import { cn } from "@honeyicons/ui/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";
import { GITHUB_URL } from "@/components/site-header";
import { docsPages } from "./docs-nav";

export type TocItem = { id: string; label: string };

function useActiveSection(toc: readonly TocItem[]) {
	const [active, setActive] = useState(toc[0]?.id ?? "");

	useEffect(() => {
		let frame = 0;
		function update() {
			// Below the sticky header (and the phone menu bar).
			const offset = window.innerWidth >= 1024 ? 104 : 148;
			let current = toc[0]?.id ?? "";
			for (const { id } of toc) {
				const element = document.getElementById(id);
				if (element && element.getBoundingClientRect().top <= offset) {
					current = id;
				}
			}
			const atBottom =
				window.scrollY > 0 &&
				window.innerHeight + window.scrollY >=
					document.documentElement.scrollHeight - 2;
			setActive(atBottom ? (toc.at(-1)?.id ?? current) : current);
		}
		function schedule() {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(update);
		}
		update();
		window.addEventListener("scroll", schedule, { passive: true });
		window.addEventListener("resize", schedule);
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener("scroll", schedule);
			window.removeEventListener("resize", schedule);
		};
	}, [toc]);

	return [active, setActive] as const;
}

function TableOfContents({ toc }: { toc: readonly TocItem[] }) {
	const [active, setActive] = useActiveSection(toc);
	if (toc.length === 0) return null;
	return (
		<nav aria-label="On this page" className="text-label">
			<p className="mb-3 font-medium text-caption">On this page</p>
			<ul className="flex flex-col border-border border-l">
				{toc.map(({ id, label }) => (
					<li key={id}>
						<a
							href={`#${id}`}
							aria-current={active === id ? "location" : undefined}
							onClick={() => setActive(id)}
							className={cn(
								"-ml-px block border-l py-2 pl-4 transition-colors",
								active === id
									? "border-primary font-medium text-primary"
									: "border-transparent text-muted-foreground hover:text-foreground",
							)}
						>
							{label}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}

function PagerLink({
	page,
	direction,
}: {
	page: (typeof docsPages)[number];
	direction: "previous" | "next";
}) {
	const next = direction === "next";
	return (
		<Link
			to={page.to}
			className={cn(
				"group flex flex-1 flex-col gap-1 surface rounded-2xl p-4 transition-colors hover:bg-card",
				next && "items-end text-right",
			)}
		>
			<span className="flex items-center gap-1 text-caption text-muted-foreground">
				{!next && <ArrowLeft size={14} />}
				{next ? "Next" : "Previous"}
				{next && <ArrowRight size={14} />}
			</span>
			<span className="font-medium">{page.label}</span>
		</Link>
	);
}

/** One docs article: eyebrow, title, lead, body, pager, and a table of contents on wide screens. */
export function DocsPage({
	title,
	description,
	toc = [],
	children,
}: {
	title: string;
	description: ReactNode;
	toc?: readonly TocItem[];
	children: ReactNode;
}) {
	const pathname = useLocation({ select: (location) => location.pathname });
	const index = docsPages.findIndex((page) => page.to === pathname);
	const page = docsPages[index];
	const previous = index > 0 ? docsPages[index - 1] : undefined;
	const next = index >= 0 ? docsPages[index + 1] : undefined;

	return (
		<div className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_200px]">
			<article className="mx-auto w-full min-w-0 max-w-3xl py-8 sm:py-12">
				<header className="mb-8">
					{page && (
						<p className="mb-2 font-medium text-label text-primary">
							{page.group}
						</p>
					)}
					<h1 className="text-balance font-medium text-title">{title}</h1>
					<p className="mt-4 max-w-2xl text-body text-muted-foreground sm:text-lead">
						{description}
					</p>
				</header>
				<div className="flex flex-col gap-12">{children}</div>
				{(previous || next) && (
					<nav aria-label="Pages" className="mt-16 flex gap-4">
						{previous ? (
							<PagerLink page={previous} direction="previous" />
						) : (
							<span className="flex-1" />
						)}
						{next ? (
							<PagerLink page={next} direction="next" />
						) : (
							<span className="flex-1" />
						)}
					</nav>
				)}
				<footer className="mt-12 flex items-center gap-4 border-border border-t pt-6 text-label text-muted-foreground">
					<span>Honeyicons is free and MIT licensed.</span>
					<a
						href={GITHUB_URL}
						target="_blank"
						rel="noreferrer"
						className="ml-auto flex items-center gap-2 hover:text-foreground"
					>
						<Github size={16} />
						GitHub
					</a>
				</footer>
			</article>
			<aside className="no-scrollbar sticky top-16 hidden h-[calc(100svh-4rem)] overflow-y-auto py-12 xl:block">
				<TableOfContents toc={toc} />
			</aside>
		</div>
	);
}

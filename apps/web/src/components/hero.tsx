import { Button } from "@honeyicons/ui/components/button";
import {
	AiChat01Icon,
	ArrowRight01Icon,
	BotIcon,
	ChatIcon,
	Copy01Icon,
	File01Icon,
	Folder01Icon,
	GitBranchIcon,
	GitCommitIcon,
	LayoutDashboardIcon,
	Loading03Icon,
	Search01Icon,
	Settings01Icon,
	SourceCodeIcon,
	SparklesIcon,
	TerminalIcon,
	Tick02Icon,
	UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

const wallpaper = [
	ChatIcon,
	SourceCodeIcon,
	GitBranchIcon,
	Folder01Icon,
	SparklesIcon,
	LayoutDashboardIcon,
	UserIcon,
	TerminalIcon,
	BotIcon,
	File01Icon,
	AiChat01Icon,
	GitCommitIcon,
	Search01Icon,
	Settings01Icon,
	Copy01Icon,
	Tick02Icon,
	Loading03Icon,
];

const wallpaperIcons = [...wallpaper, ...wallpaper, ...wallpaper];

export function Hero() {
	return (
		<section className="relative overflow-hidden">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_72%,transparent),radial-gradient(ellipse_at_center,black_28%,transparent_72%)]"
			>
				<div className="mx-auto grid w-full max-w-7xl grid-cols-6 gap-x-8 gap-y-12 px-4 py-16 opacity-[0.18] sm:grid-cols-8 sm:px-6 md:grid-cols-10 lg:grid-cols-12">
					{wallpaperIcons.map((icon, index) => (
						<HugeiconsIcon
							key={index}
							icon={icon}
							size={32}
							strokeWidth={1.5}
							className="text-foreground"
						/>
					))}
				</div>
			</div>

			<div className="relative mx-auto flex min-h-[calc(100svh-3.5rem)] w-full max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
				<h1 className="text-balance font-heading font-medium text-4xl tracking-tight sm:text-6xl md:text-7xl">
					Icons for chat, IDEs,{" "}
					<span className="text-muted-foreground">and dashboards</span>
				</h1>
				<p className="mt-6 max-w-lg text-pretty text-base text-muted-foreground sm:text-lg">
					Linear, bold, and duotone on one 24 grid. A send icon you draw in
					March still matches one you add in November.
				</p>
				<div className="mt-10 flex flex-wrap items-center justify-center gap-2">
					<Button
						size="lg"
						nativeButton={false}
						render={<Link href="/icons" />}
					>
						Browse icons
						<HugeiconsIcon
							icon={ArrowRight01Icon}
							strokeWidth={2}
							data-icon="inline-end"
						/>
					</Button>
					<Button
						size="lg"
						variant="ghost"
						nativeButton={false}
						render={<a href="https://github.com/arjunkambj/honeyicons" />}
					>
						Install
					</Button>
				</div>
			</div>
		</section>
	);
}

import { catalog } from "@honeyicons/react/catalog";
import { Button } from "@honeyicons/ui/components/button";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { InstallCommand } from "@/components/install-command";

const wallpaperIcons = [...catalog, ...catalog, ...catalog];

export function Hero() {
	return (
		<section className="relative overflow-hidden">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_68%,transparent),radial-gradient(ellipse_at_center,transparent_32%,black_74%)]"
			>
				<div className="mx-auto grid w-full max-w-7xl grid-cols-6 gap-x-8 gap-y-12 px-4 py-16 opacity-[0.18] sm:grid-cols-8 sm:px-6 md:grid-cols-10 lg:grid-cols-12">
					{wallpaperIcons.map((item, index) => {
						const Icon = item.component;
						return <Icon key={index} size={32} className="text-foreground" />;
					})}
				</div>
			</div>

			<div className="relative mx-auto flex min-h-[calc(100svh-3.5rem)] w-full max-w-7xl flex-col items-center justify-center px-4 pt-16 pb-40 text-center sm:px-6">
				<h1 className="animate-hero-enter text-balance font-heading font-medium text-4xl leading-[1.12] tracking-tight sm:text-6xl sm:leading-[1.08] md:text-7xl md:leading-[1.05]">
					<span className="block">Icons for chat,</span>
					<span className="block">
						IDEs, <span className="text-muted-foreground">and dashboards</span>
					</span>
				</h1>
				<p
					className="mt-6 max-w-lg animate-hero-enter text-pretty text-base text-muted-foreground sm:text-lg"
					style={{ animationDelay: "120ms" }}
				>
					Linear, bold, and duotone on a 24 grid. A send icon you draw in March
					still matches one you add in November.
				</p>
				<div
					className="mt-10 flex animate-hero-enter flex-wrap items-center justify-center gap-3"
					style={{ animationDelay: "240ms" }}
				>
					<Button
						size="lg"
						nativeButton={false}
						render={<Link href="/icons" />}
					>
						Browse icons
						<HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
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
				<div className="animate-hero-enter" style={{ animationDelay: "360ms" }}>
					<InstallCommand />
				</div>
			</div>
		</section>
	);
}

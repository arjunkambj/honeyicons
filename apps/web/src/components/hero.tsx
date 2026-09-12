import {
	ChevronRight,
	Code,
	Command,
	FolderOpen,
	Layers,
	Lightning,
	Search,
	Settings,
	SquarePen,
	Star,
	Sun,
	Terminal,
	Widget,
} from "@honeyicons/react";
import { catalog } from "@honeyicons/react/catalog";
import { Button } from "@honeyicons/ui/components/button";
import { cn } from "@honeyicons/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { BrandMark } from "@/components/brand-mark";
import { InstallCommand } from "@/components/install-command";
import styles from "@/components/marketing.module.css";

const orbitIcons = [
	{ icon: Code, x: 32, y: 8, rotation: -12 },
	{ icon: SquarePen, x: 63, y: 7, rotation: 12 },
	{ icon: Command, x: 14, y: 25, rotation: -12 },
	{ icon: Lightning, x: 52, y: 23, rotation: 10 },
	{ icon: Layers, x: 82, y: 24, rotation: 12 },
	{ icon: Terminal, x: 30, y: 34, rotation: -8 },
	{ icon: Sun, x: 69, y: 38, rotation: 14 },
	{ icon: FolderOpen, x: 7, y: 49, rotation: -12 },
	{ icon: Widget, x: 91, y: 50, rotation: 10 },
	{ icon: Star, x: 24, y: 61, rotation: -8 },
	{ icon: Settings, x: 74, y: 65, rotation: 12 },
];

export function Hero() {
	return (
		<section
			className={cn(styles.hero, styles.gradientPanel)}
			aria-labelledby="hero-heading"
		>
			<div className={styles.heroContent}>
				<h1
					id="hero-heading"
					className="animate-hero-enter text-balance font-heading font-semibold tracking-tight"
				>
					<span className="block">Beautiful icons.</span>
					<span className="block text-hero-muted-foreground">
						Built for what’s next.
					</span>
				</h1>
				<p
					className="mt-3 max-w-md animate-hero-enter text-pretty text-hero-muted-foreground"
					style={{ animationDelay: "100ms" }}
				>
					{catalog.length} crisp icons for apps, editors, and dashboards. Ready
					for React, typed for TypeScript, and easy for your AI to use.
				</p>
				<div
					className="mt-6 flex animate-hero-enter flex-wrap justify-center gap-3 sm:gap-4"
					style={{ animationDelay: "200ms" }}
				>
					<Button
						size="lg"
						className="px-5"
						nativeButton={false}
						render={<Link to="/icons" />}
					>
						<Search data-icon="inline-start" />
						Explore icons
					</Button>
					<Button
						size="lg"
						variant="outline"
						className="px-5"
						nativeButton={false}
						render={<Link to="/docs" />}
					>
						Get started
						<ChevronRight data-icon="inline-end" />
					</Button>
				</div>
				<div className="mb-12 max-w-full sm:mb-16">
					<InstallCommand className="mt-4" />
				</div>
			</div>
			<div className={styles.orbitScene} aria-hidden="true">
				<div className={styles.orbitLabel}>
					<span className={styles.colorDot} /> Linear{" "}
					<span className="font-mono text-hero-muted-foreground">
						Made to match
					</span>
				</div>
				<div className={styles.orbitLabelRight}>
					24 × 24{" "}
					<span className="text-hero-muted-foreground">A considered grid</span>
				</div>
				<div className={styles.orbit}>
					<div className={styles.orbitMiddle} />
					<div className={styles.orbitInner} />
					{orbitIcons.map(({ icon: Icon, x, y, rotation }) => (
						<Icon
							key={x}
							className={styles.orbitIcon}
							style={{
								left: `${x}%`,
								top: `${y}%`,
								transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
							}}
						/>
					))}
					<div className={styles.orbitCore}>
						<BrandMark className="size-9" />
						<span>Small details.</span>
						<span className="text-hero-muted-foreground">
							Endless possibilities.
						</span>
					</div>
				</div>
				<div className={styles.strokeLabel}>
					Stroke width <span className="font-mono text-2xl">1.8</span>
				</div>
			</div>
		</section>
	);
}

import {
	ChevronRight,
	Chrome,
	Discord,
	Facebook,
	Github,
	Google,
	Instagram,
	Linkedin,
	Pinterest,
	Reddit,
	Search,
	Slack,
	Snapchat,
	Telegram,
	Threads,
	Tiktok,
	Twitter,
	X,
	Youtube,
	type HoneyIcon,
} from "@honeyicons/react";
import { catalog } from "@honeyicons/react/catalog";
import { Button } from "@honeyicons/ui/components/button";
import { cn } from "@honeyicons/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { toast } from "sonner";
import { BrandMark } from "@/components/brand-mark";
import { InstallCommand } from "@/components/install-command";
import styles from "@/components/marketing.module.css";
import { setupPrompt } from "@/lib/setup-prompt";

type OrbitIcon = {
	icon: HoneyIcon;
	/** Position around the ring in degrees. -90 is the top. */
	angle: number;
	/** Static playful tilt in degrees. */
	tilt: number;
	muted?: boolean;
};

type OrbitRing = {
	/** Distance from the center, as a percentage of the orbit size. */
	radius: number;
	/** Time for one full revolution. */
	duration: string;
	reverse?: boolean;
	icons: OrbitIcon[];
};

const orbitRings: OrbitRing[] = [
	{
		radius: 50,
		duration: "28s",
		icons: [
			{ icon: X, angle: -90, tilt: 0 },
			{ icon: Instagram, angle: -39, tilt: 8, muted: true },
			{ icon: Twitter, angle: 13, tilt: 0 },
			{ icon: Youtube, angle: 64, tilt: -8, muted: true },
			{ icon: Tiktok, angle: 116, tilt: 0 },
			{ icon: Discord, angle: 167, tilt: 8, muted: true },
			{ icon: Github, angle: 219, tilt: 0 },
		],
	},
	{
		radius: 37,
		duration: "20s",
		reverse: true,
		icons: [
			{ icon: Facebook, angle: -90, tilt: 0 },
			{ icon: Linkedin, angle: -30, tilt: -8, muted: true },
			{ icon: Snapchat, angle: 30, tilt: 0 },
			{ icon: Telegram, angle: 90, tilt: 8, muted: true },
			{ icon: Reddit, angle: 150, tilt: 0 },
			{ icon: Pinterest, angle: 210, tilt: -8, muted: true },
		],
	},
	{
		radius: 21,
		duration: "14s",
		icons: [
			{ icon: Google, angle: -90, tilt: 0 },
			{ icon: Chrome, angle: 0, tilt: 0, muted: true },
			{ icon: Slack, angle: 90, tilt: 0 },
			{ icon: Threads, angle: 180, tilt: 0, muted: true },
		],
	},
];

export function Hero() {
	const [promptCopied, setPromptCopied] = useState(false);
	const copyTimeoutRef = useRef(0);

	useEffect(() => () => window.clearTimeout(copyTimeoutRef.current), []);

	async function copySetupPrompt() {
		try {
			await navigator.clipboard.writeText(setupPrompt);
		} catch {
			toast.error(
				"Could not copy. Check your browser’s clipboard permissions.",
			);
			return;
		}
		setPromptCopied(true);
		window.clearTimeout(copyTimeoutRef.current);
		copyTimeoutRef.current = window.setTimeout(
			() => setPromptCopied(false),
			2000,
		);
	}

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
					<span className="block">Icons for React.</span>
					<span className="block text-hero-muted-foreground">
						One consistent style.
					</span>
				</h1>
				<p
					className="mt-3 max-w-md animate-hero-enter text-pretty text-hero-muted-foreground"
					style={{ animationDelay: "100ms" }}
				>
					{catalog.length} line icons on a 24px grid. Import them as typed
					components, and they take the color of the text around them.
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
					<button
						type="button"
						onClick={copySetupPrompt}
						className="mx-auto mt-3 block text-sm text-hero-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
					>
						{promptCopied ? "Prompt copied" : "Copy agent setup prompt"}
					</button>
				</div>
			</div>
			<div className={styles.orbitScene} aria-hidden="true">
				<div className={styles.orbitLabel}>
					<span className={styles.colorDot} /> Linear{" "}
					<span className="font-mono text-hero-muted-foreground">Style</span>
				</div>
				<div className={styles.orbitLabelRight}>
					24 × 24 <span className="text-hero-muted-foreground">Grid</span>
				</div>
				<div className={styles.orbit}>
					<div className={styles.orbitMiddle} />
					<div className={styles.orbitInner} />
					<div className={styles.orbitIcons}>
						{orbitRings.map((ring, ringIndex) => (
							<div
								key={ringIndex}
								className={cn(
									styles.orbitSpin,
									ring.reverse && styles.orbitSpinReverse,
								)}
								style={{ animationDuration: ring.duration }}
							>
								{ring.icons.map(({ icon: Icon, angle, tilt, muted }) => {
									const radian = (angle * Math.PI) / 180;
									const left = 50 + ring.radius * Math.cos(radian);
									const top = 50 + ring.radius * Math.sin(radian);
									const phase = ((angle % 360) + 360) % 360;
									return (
										<div
											key={angle}
											className={styles.orbitSlot}
											style={{ left: `${left}%`, top: `${top}%` }}
										>
											<div
												className={cn(
													styles.orbitCounter,
													!ring.reverse && styles.orbitCounterReverse,
												)}
												style={{ animationDuration: ring.duration }}
											>
												<div
													className={styles.orbitTilt}
													style={
														{
															"--orbit-tilt": `${tilt}deg`,
															animationDelay: `${-(phase / 360) * 5.5}s`,
														} as CSSProperties
													}
												>
													<Icon
														size={34}
														className={cn(
															styles.orbitIcon,
															muted && styles.orbitIconMuted,
														)}
														style={{
															animationDelay: `${-(phase / 360) * 7}s`,
														}}
													/>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						))}
					</div>
					<div className={styles.orbitCore}>
						<BrandMark className="size-9" />
						<span>Honeyicons</span>
						<span className="text-hero-muted-foreground">
							{catalog.length} icons
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

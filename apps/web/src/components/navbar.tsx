import { Computer, Github, Moon, Sun } from "@honeyicons/react";
import { Button } from "@honeyicons/ui/components/button";
import {
	ToggleGroup,
	ToggleGroupItem,
} from "@honeyicons/ui/components/toggle-group";
import { Link } from "@tanstack/react-router";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { BrandLogo } from "@/components/brand-mark";
import styles from "@/components/marketing.module.css";

const themeOptions = [
	{ value: "light", label: "Light theme", icon: Sun },
	{ value: "dark", label: "Dark theme", icon: Moon },
	{ value: "system", label: "System theme", icon: Computer },
] as const;

const emptySubscribe = () => () => {};

function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const mounted = useSyncExternalStore(
		emptySubscribe,
		() => true,
		() => false,
	);
	const selectedTheme = mounted ? (theme ?? "light") : undefined;
	const selectedIndex = themeOptions.findIndex(
		(option) => option.value === selectedTheme,
	);

	return (
		<ToggleGroup
			variant="segmented"
			size="sm"
			spacing={0.5}
			className="relative isolate p-0.5"
			aria-label="Color theme"
			value={selectedTheme ? [selectedTheme] : []}
			disabled={!mounted}
			onValueChange={(values) => {
				const nextTheme = values[0];
				if (nextTheme) setTheme(nextTheme);
			}}
		>
			<span
				aria-hidden="true"
				className="pointer-events-none absolute top-0.5 left-0.5 -z-1 size-7 rounded-full bg-background transition-transform duration-200 ease-out motion-reduce:transition-none"
				style={{
					transform: `translateX(${Math.max(0, selectedIndex) * 30}px)`,
					opacity: mounted ? 1 : 0,
				}}
			/>
			{themeOptions.map(({ value, label, icon: Icon }) => (
				<ToggleGroupItem
					key={value}
					value={value}
					aria-label={label}
					title={label}
					className="size-7 min-w-7 px-0"
				>
					<Icon variant="bold" />
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
}

export function Navbar() {
	return (
		<header className={styles.header}>
			<div className="container mx-auto px-7 sm:px-10 lg:px-12">
				<div className={styles.navbar}>
					<Link
						to="/"
						aria-label="honeyicons home"
						className="flex shrink-0 items-center text-foreground"
					>
						<BrandLogo className="h-5 w-28 sm:h-6 sm:w-[148px] min-[380px]:w-[120px]" />
					</Link>
					<nav aria-label="Main navigation" className={styles.navLinks}>
						<Link to="/icons">Explore icons</Link>
						<Link to="/docs" className={styles.docsLink}>
							Docs
						</Link>
					</nav>
					<div className={styles.navActions}>
						<ThemeToggle />
						<Button
							variant="secondary"
							size="sm"
							className="w-8 px-0 sm:w-auto sm:px-3"
							nativeButton={false}
							aria-label="GitHub"
							render={
								<a
									href="https://github.com/arjunkambj/honeyicons"
									target="_blank"
									rel="noreferrer"
								/>
							}
						>
							<Github data-icon="inline-start" />
							<span className="hidden sm:inline">GitHub</span>
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}

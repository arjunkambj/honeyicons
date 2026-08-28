"use client";

import { Button } from "@honeyicons/ui/components/button";
import { Separator } from "@honeyicons/ui/components/separator";
import {
	GithubIcon,
	Honey01Icon,
	Moon02Icon,
	NewTwitterIcon,
	Sun03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const GITHUB_URL = "https://github.com/arjunkambj/honeyicons";
const X_URL = "https://x.com";

const links = [
	{ href: "/icons", label: "Icons", external: false },
	{ href: "/install", label: "Install", external: false },
] as const;

function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const isDark = resolvedTheme === "dark";

	return (
		<Button
			variant="ghost"
			size="icon-sm"
			type="button"
			aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
			onClick={() => setTheme(isDark ? "light" : "dark")}
			disabled={!mounted}
		>
			{mounted && isDark ? (
				<HugeiconsIcon icon={Sun03Icon} strokeWidth={2} />
			) : (
				<HugeiconsIcon icon={Moon02Icon} strokeWidth={2} />
			)}
		</Button>
	);
}

export function Navbar() {
	return (
		<header className="sticky top-0 z-10 border-transparent border-b bg-background/80 backdrop-blur-md">
			<div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
				<Link href="/" className="flex items-center gap-2 font-medium text-sm">
					<span className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background">
						<HugeiconsIcon icon={Honey01Icon} strokeWidth={2} />
					</span>
					honeyicons
				</Link>

				<div className="flex items-center gap-1 sm:gap-3">
					<nav className="hidden items-center gap-5 text-muted-foreground text-sm md:flex">
						{links.map((link) =>
							link.external ? (
								<a
									key={link.href}
									href={link.href}
									className="transition-colors hover:text-foreground"
								>
									{link.label}
								</a>
							) : (
								<Link
									key={link.href}
									href={link.href}
									className="transition-colors hover:text-foreground"
								>
									{link.label}
								</Link>
							),
						)}
					</nav>

					<Separator
						orientation="vertical"
						className="hidden h-4 self-center sm:block"
					/>

					<Button
						variant="ghost"
						size="icon-sm"
						nativeButton={false}
						render={<a href={X_URL} target="_blank" rel="noreferrer" />}
					>
						<HugeiconsIcon icon={NewTwitterIcon} strokeWidth={2} />
						<span className="sr-only">X</span>
					</Button>
					<Button
						variant="ghost"
						size="icon-sm"
						nativeButton={false}
						render={<a href={GITHUB_URL} target="_blank" rel="noreferrer" />}
					>
						<HugeiconsIcon icon={GithubIcon} strokeWidth={2} />
						<span className="sr-only">GitHub</span>
					</Button>
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}

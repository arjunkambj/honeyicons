"use client";

import { Toaster } from "@honeyicons/ui/components/sonner";
import { ReactLenis } from "lenis/react";

import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<ReactLenis
				root
				options={{
					autoRaf: true,
					lerp: 0.1,
					anchors: true,
					autoToggle: true,
					allowNestedScroll: true,
					stopInertiaOnNavigate: true,
					respectReducedMotion: true,
				}}
			>
				{children}
			</ReactLenis>
			<Toaster richColors />
		</ThemeProvider>
	);
}

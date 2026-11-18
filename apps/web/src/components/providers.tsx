import { Toaster } from "@honeyicons/ui/components/sonner";
import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";
import { ThemeColor } from "./theme-color";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="light"
			enableSystem
			disableTransitionOnChange
		>
			<ThemeColor />
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

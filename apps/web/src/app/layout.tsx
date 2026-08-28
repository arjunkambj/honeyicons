import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "../index.css";
import { cn } from "@honeyicons/ui/lib/utils";
import Providers from "@/components/providers";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

export const metadata: Metadata = {
	title: "honeyicons",
	description: "Icons for chat, IDEs, and dashboards.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={cn(inter.variable, inter.className)}
		>
			<body className="font-sans antialiased">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}

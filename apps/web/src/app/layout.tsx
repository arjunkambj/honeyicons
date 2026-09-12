import { CalSansUI } from "@calcom/cal-sans-ui/ui";
import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";

import "../index.css";
import { cn } from "@honeyicons/ui/lib/utils";
import Providers from "@/components/providers";

const bricolageGrotesque = Bricolage_Grotesque({
	subsets: ["latin"],
	variable: "--font-bricolage-grotesque",
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
			className={cn(bricolageGrotesque.variable, CalSansUI.variable)}
		>
			<body className="font-sans antialiased">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}

import { Button } from "@honeyicons/ui/components/button";
import {
	createRootRoute,
	type ErrorComponentProps,
	HeadContent,
	Link,
	Outlet,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PageActions, PageHeader } from "@/components/page-header";
import Providers from "@/components/providers";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ title: "honeyicons" },
			{
				name: "description",
				content: "Line icons for React.",
			},
		],
	}),
	component: RootLayout,
	errorComponent: DefaultError,
});

function SiteFrame({ children }: { children: ReactNode }) {
	return (
		<Providers>
			<HeadContent />
			<div className="flex min-h-svh flex-col">
				<a
					href="#content"
					className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:font-medium focus:text-background focus:text-sm"
				>
					Skip to content
				</a>
				<Navbar />
				<div id="content" tabIndex={-1} className="flex-1 outline-none">
					{children}
				</div>
				<div className="page-gutter pb-12 sm:pb-16">
					<Footer />
				</div>
			</div>
		</Providers>
	);
}

function RootLayout() {
	return (
		<SiteFrame>
			<Outlet />
		</SiteFrame>
	);
}

function DefaultError({ error }: ErrorComponentProps) {
	const message =
		error instanceof Error ? error.message : "An unexpected error occurred.";

	return (
		<SiteFrame>
			<main className="page-shell">
				<PageHeader
					eyebrow="Error"
					title="Something went wrong"
					description={message}
				>
					<PageActions>
						<Button nativeButton={false} render={<Link to="/" />}>
							Back home
						</Button>
					</PageActions>
				</PageHeader>
			</main>
		</SiteFrame>
	);
}

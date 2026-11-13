import { Button } from "@honeyicons/ui/components/button";
import {
	createRootRoute,
	type ErrorComponentProps,
	HeadContent,
	Link,
	Outlet,
	useLocation,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { PageActions, PageHeader } from "@/components/page-header";
import Providers from "@/components/providers";
import { SiteHeader } from "@/components/site-header";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ title: "Honeyicons" },
			{
				name: "description",
				content: "React icons in a linear and a bold style.",
			},
		],
	}),
	component: RootLayout,
	errorComponent: DefaultError,
});

function SiteFrame({
	header = true,
	children,
}: {
	header?: boolean;
	children: ReactNode;
}) {
	return (
		<Providers>
			<HeadContent />
			<div className="flex min-h-svh flex-col">
				<a
					href="#content"
					className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:font-medium focus:text-background focus:text-label"
				>
					Skip to content
				</a>
				{header && <SiteHeader />}
				<div
					id="content"
					tabIndex={-1}
					className="flex flex-1 flex-col outline-none"
				>
					{children}
				</div>
			</div>
		</Providers>
	);
}

function RootLayout() {
	// Home is a full-screen stage with its own links.
	const isHome = useLocation({
		select: (location) => location.pathname === "/",
	});
	return (
		<SiteFrame header={!isHome}>
			<Outlet />
		</SiteFrame>
	);
}

function DefaultError({ error }: ErrorComponentProps) {
	const message =
		error instanceof Error
			? error.message
			: "Something broke while loading this page.";

	return (
		<SiteFrame>
			<main className="page-gutter py-12 sm:py-16">
				<PageHeader
					eyebrow="Error"
					title="This page broke"
					description={message}
				>
					<PageActions>
						<Button nativeButton={false} render={<Link to="/" />}>
							Go home
						</Button>
					</PageActions>
				</PageHeader>
			</main>
		</SiteFrame>
	);
}

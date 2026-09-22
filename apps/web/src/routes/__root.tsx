import {
	createRootRoute,
	type ErrorComponentProps,
	HeadContent,
	Link,
	Outlet,
} from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";
import Providers from "@/components/providers";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ title: "honeyicons" },
			{
				name: "description",
				content: "Icons for chat, IDEs, and dashboards.",
			},
		],
	}),
	component: RootLayout,
	errorComponent: DefaultError,
});

function RootLayout() {
	return (
		<Providers>
			<HeadContent />
			<Navbar />
			<Outlet />
		</Providers>
	);
}

function DefaultError({ error }: ErrorComponentProps) {
	const message =
		error instanceof Error ? error.message : "An unexpected error occurred.";

	return (
		<main className="page-shell">
			<p className="mb-3 text-muted-foreground text-sm">Error</p>
			<h1 className="font-heading font-medium text-4xl leading-tight tracking-tight sm:text-5xl">
				Something went wrong
			</h1>
			<p className="mt-4 max-w-xl text-muted-foreground leading-7">{message}</p>
			<p className="mt-8">
				<Link
					to="/"
					className="text-foreground underline-offset-4 hover:underline"
				>
					Back home
				</Link>
			</p>
		</main>
	);
}

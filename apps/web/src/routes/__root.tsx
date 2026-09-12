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
		<main className="container mx-auto px-4 py-16 sm:px-6">
			<h1 className="font-semibold text-2xl tracking-tight">
				Something went wrong
			</h1>
			<p className="mt-3 max-w-xl text-muted-foreground leading-7">{message}</p>
			<p className="mt-6">
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

import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/$")({
	head: () => ({
		meta: [{ title: "Not found · honeyicons" }],
	}),
	component: NotFoundPage,
});

function NotFoundPage() {
	return (
		<main className="container mx-auto px-4 py-16 sm:px-6">
			<p className="text-muted-foreground text-sm">404</p>
			<h1 className="mt-2 font-semibold text-3xl tracking-tight">
				Page not found
			</h1>
			<p className="mt-3 max-w-md text-muted-foreground leading-7">
				That URL is not part of the Honeyicons site.
			</p>
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

import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/$")({
	head: () => ({
		meta: [{ title: "Not found · honeyicons" }],
	}),
	component: NotFoundPage,
});

function NotFoundPage() {
	return (
		<main className="page-shell">
			<p className="mb-3 text-muted-foreground text-sm">404</p>
			<h1 className="font-heading font-medium text-4xl leading-tight tracking-tight sm:text-5xl">
				Page not found
			</h1>
			<p className="mt-4 max-w-xl text-muted-foreground leading-7">
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

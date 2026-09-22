import { Button } from "@honeyicons/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageActions, PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/$")({
	head: () => ({
		meta: [{ title: "Not found · honeyicons" }],
	}),
	component: NotFoundPage,
});

function NotFoundPage() {
	return (
		<main className="page-shell">
			<PageHeader
				eyebrow="404"
				title="Page not found"
				description="That URL is not part of the Honeyicons site."
			>
				<PageActions>
					<Button nativeButton={false} render={<Link to="/" />}>
						Back home
					</Button>
					<Button
						variant="outline"
						nativeButton={false}
						render={<Link to="/icons" />}
					>
						Explore icons
					</Button>
				</PageActions>
			</PageHeader>
		</main>
	);
}

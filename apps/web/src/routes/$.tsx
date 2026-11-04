import { Button } from "@honeyicons/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageActions, PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/$")({
	head: () => ({
		meta: [{ title: "Page not found · Honeyicons" }],
	}),
	component: NotFoundPage,
});

function NotFoundPage() {
	return (
		<main className="page-gutter py-16 sm:py-24">
			<PageHeader
				eyebrow="404"
				title="We can’t find that page"
				description="The link may be old, or the address has a typo. The icons and the docs are still where they were."
			>
				<PageActions>
					<Button nativeButton={false} render={<Link to="/icons" />}>
						Browse icons
					</Button>
					<Button
						variant="secondary"
						nativeButton={false}
						render={<Link to="/docs" />}
					>
						Read the docs
					</Button>
				</PageActions>
			</PageHeader>
		</main>
	);
}

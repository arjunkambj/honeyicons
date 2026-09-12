import { createFileRoute } from "@tanstack/react-router";
import { IconBrowser } from "@/components/icons/icon-browser";

export const Route = createFileRoute("/icons")({
	head: () => ({
		meta: [
			{ title: "Icons · honeyicons" },
			{
				name: "description",
				content: "Browse linear, bold, and duotone icons.",
			},
		],
	}),
	component: IconsPage,
});

function IconsPage() {
	return (
		<main className="container mx-auto px-7 pt-4 pb-8 sm:px-10 lg:px-12">
			<IconBrowser />
		</main>
	);
}

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
		<main className="page-shell">
			<IconBrowser />
		</main>
	);
}

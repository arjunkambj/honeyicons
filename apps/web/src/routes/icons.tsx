import { createFileRoute } from "@tanstack/react-router";
import { IconBrowser } from "@/components/icons/icon-browser";
import { parseIconsSearch } from "@/components/icons/constants";

export const Route = createFileRoute("/icons")({
	head: () => ({
		meta: [
			{ title: "Icons · honeyicons" },
			{
				name: "description",
				content:
					"Search icons by name or keyword, filter by category and style, and copy React snippets.",
			},
		],
	}),
	validateSearch: parseIconsSearch,
	component: IconsPage,
});

function IconsPage() {
	return (
		<main className="page-shell">
			<IconBrowser />
		</main>
	);
}

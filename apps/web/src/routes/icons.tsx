import { createFileRoute } from "@tanstack/react-router";
import { parseIconsSearch } from "@/components/icons/constants";
import { IconBrowser } from "@/components/icons/icon-browser";

export const Route = createFileRoute("/icons")({
	head: () => ({
		meta: [
			{ title: "Icons · Honeyicons" },
			{
				name: "description",
				content:
					"Search every Honeyicons icon by name or by what it shows. Click one to switch styles and copy its React code or SVG.",
			},
		],
	}),
	validateSearch: parseIconsSearch,
	component: IconBrowser,
});

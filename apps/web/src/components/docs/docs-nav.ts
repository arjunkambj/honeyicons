import type { IconName } from "@honeyicons/react";

export type DocsPath =
	| "/docs"
	| "/docs/quickstart"
	| "/docs/agents"
	| "/docs/icon"
	| "/docs/styles"
	| "/docs/accessibility"
	| "/changelog";

export type DocsNavItem =
	| { to: DocsPath | "/icons"; href?: never; label: string; icon: IconName }
	| { href: string; to?: never; label: string; icon: IconName };

export type DocsNavGroup = { title: string; items: DocsNavItem[] };

export const docsNav: DocsNavGroup[] = [
	{
		title: "Get started",
		items: [
			{ to: "/docs", label: "Introduction", icon: "book-open" },
			{ to: "/docs/quickstart", label: "Quickstart", icon: "rocket" },
			{ to: "/docs/agents", label: "Agent setup", icon: "sparkles" },
		],
	},
	{
		title: "Using icons",
		items: [
			{ to: "/docs/icon", label: "Icon component", icon: "code" },
			{ to: "/docs/styles", label: "Styles and sizes", icon: "palette" },
			{ to: "/docs/accessibility", label: "Accessibility", icon: "eye" },
		],
	},
	{
		title: "Resources",
		items: [
			{ to: "/changelog", label: "Changelog", icon: "history" },
			{ to: "/icons", label: "Icon catalog", icon: "widget" },
			{ href: "/llms.txt", label: "llms.txt", icon: "brain" },
			{
				href: "/credits.txt",
				label: "Licenses and credits",
				icon: "file-text",
			},
		],
	},
];

/** Pages in reading order, for the previous and next links. */
export const docsPages = docsNav.flatMap((group) =>
	group.items.flatMap((item) =>
		item.to && item.to !== "/icons"
			? [{ to: item.to, label: item.label, group: group.title }]
			: [],
	),
);

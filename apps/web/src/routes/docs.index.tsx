import { Icon, ICON_CATEGORIES } from "@honeyicons/react";
import { catalog } from "@honeyicons/react/catalog";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Callout,
	CardGroup,
	LinkCard,
	Preview,
	Prose,
	Sample,
	Section,
} from "@/components/docs/blocks";
import { DocsPage } from "@/components/docs/docs-page";

const toc = [
	{ id: "start-here", label: "Start here" },
	{ id: "how-they-are-drawn", label: "How the icons are drawn" },
	{ id: "whats-included", label: "What’s included" },
] as const;

export const Route = createFileRoute("/docs/")({
	head: () => ({
		meta: [
			{ title: "Introduction · Honeyicons docs" },
			{
				name: "description",
				content:
					"What Honeyicons is, how the icons are drawn, and where to start.",
			},
		],
	}),
	component: Introduction,
});

function Introduction() {
	return (
		<DocsPage
			title="Introduction"
			description={`Honeyicons is a set of ${catalog.length} icons for React. Every icon has a linear and a bold version, and all of them share one grid and one line weight, so they sit together without looking borrowed from different sets.`}
			toc={toc}
		>
			<Section id="start-here" title="Start here">
				<CardGroup>
					<LinkCard to="/docs/quickstart" icon="rocket" title="Quickstart">
						Install the package and put your first icon on the page.
					</LinkCard>
					<LinkCard to="/docs/agents" icon="sparkles" title="Agent setup">
						Paste one prompt into your coding agent and let it do the setup.
					</LinkCard>
					<LinkCard to="/docs/icon" icon="code" title="Icon component">
						Every prop, what it does, and its default.
					</LinkCard>
					<LinkCard to="/icons" icon="search" title="Icon catalog">
						Search by name or keyword, then copy the code for any icon.
					</LinkCard>
				</CardGroup>
			</Section>

			<Section id="how-they-are-drawn" title="How the icons are drawn">
				<Prose>
					Each icon is drawn on a 24 by 24 grid with a 1.8 line and round ends.
					At 16px the line is 1.2px thick and at 24px it is 1.8px. Lines are
					placed to line up with the screen’s pixels at 16, 20, and 24, so small
					icons stay sharp instead of going blurry.
				</Prose>
				<Preview>
					{(["linear", "bold"] as const).map((variant) => (
						<Sample key={variant} label={variant}>
							<div className="flex items-end gap-4">
								<Icon icon="folder-open" variant={variant} size={16} />
								<Icon icon="folder-open" variant={variant} size={24} />
								<Icon icon="folder-open" variant={variant} size={40} />
							</div>
						</Sample>
					))}
				</Preview>
				<Prose>
					Icons use the text color around them. Put one inside a muted label and
					it turns muted. Put it in a red button and it turns red.
				</Prose>
			</Section>

			<Section id="whats-included" title="What’s included">
				<Prose>
					<strong>{catalog.length} icons</strong> in{" "}
					<strong>{ICON_CATEGORIES.length} groups</strong>, from arrows and
					files to charts, devices, and weather. Brand logos such as GitHub,
					Figma, and Slack are in the set too, and many have a version in their
					own colors, named with <code>-color</code> at the end.
				</Prose>
				<Callout tone="tip">
					Can’t find an icon you need?{" "}
					<Link to="/icons">Search the catalog</Link> by name or by what it
					shows. If it isn’t there,{" "}
					<a
						href="https://github.com/arjunkambj/honeyicons/issues"
						target="_blank"
						rel="noreferrer"
					>
						ask for it on GitHub
					</a>
					.
				</Callout>
			</Section>
		</DocsPage>
	);
}

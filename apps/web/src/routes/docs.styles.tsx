import { Icon, type IconName } from "@honeyicons/react";
import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/components/code-block";
import {
	Callout,
	Preview,
	Prose,
	Sample,
	Section,
} from "@/components/docs/blocks";
import { DocsPage } from "@/components/docs/docs-page";

const toc = [
	{ id: "linear-and-bold", label: "Linear and bold" },
	{ id: "brand-colors", label: "Brand colors" },
	{ id: "sizes", label: "Sizes" },
	{ id: "color", label: "Color" },
] as const;

const pairIcons: IconName[] = ["home", "heart", "settings", "folder", "user"];
const brandPairs: IconName[][] = [
	["google", "google-color"],
	["figma", "figma-color"],
	["slack", "slack-color"],
	["youtube", "youtube-color"],
];

const styleCode = `<Icon icon="heart" />
<Icon icon="heart" variant="bold" />`;

const brandCode = `<Icon icon="figma" />        // one color, follows your text
<Icon icon="figma-color" />  // Figma's own colors`;

const colorCode = `<p className="text-zinc-500">
  <Icon icon="clock" size={16} /> Updated 2 hours ago
</p>

<Icon icon="heart" variant="bold" color="#e11d48" />`;

export const Route = createFileRoute("/docs/styles")({
	head: () => ({
		meta: [
			{ title: "Styles and sizes · Honeyicons docs" },
			{
				name: "description",
				content:
					"Choose between linear and bold, use brand colors, and pick sizes that stay sharp.",
			},
		],
	}),
	component: StylesPage,
});

function StylesPage() {
	return (
		<DocsPage
			title="Styles and sizes"
			description="Every icon comes in two styles. Brand logos can also come in their own colors. Here is when to use each, and which sizes look best."
			toc={toc}
		>
			<Section id="linear-and-bold" title="Linear and bold">
				<Prose>
					Linear is the default: outlines with a 1.8 line. Bold fills the same
					shape, so you can swap one for the other without the layout moving. A
					common pattern is linear for a menu and bold for the item that’s
					selected.
				</Prose>
				<Preview>
					{(["linear", "bold"] as const).map((variant) => (
						<Sample key={variant} label={variant}>
							<div className="flex gap-4">
								{pairIcons.map((icon) => (
									<Icon key={icon} icon={icon} variant={variant} />
								))}
							</div>
						</Sample>
					))}
				</Preview>
				<CodeBlock code={styleCode} label="style example" />
			</Section>

			<Section id="brand-colors" title="Brand colors">
				<Prose>
					Brand logos come in one color by default, so they match the rest of
					your icons. Add <code>-color</code> to the name to get the logo in the
					brand’s own colors.
				</Prose>
				<Preview>
					{brandPairs.map(([mono, color]) => (
						<Sample key={mono} label={mono}>
							<div className="flex gap-3">
								<Icon icon={mono} size={28} />
								<Icon icon={color} size={28} />
							</div>
						</Sample>
					))}
				</Preview>
				<CodeBlock code={brandCode} label="brand example" />
			</Section>

			<Section id="sizes" title="Sizes">
				<Prose>
					The default size is 24. Use 16 inside text and small buttons, 20 in
					most buttons and menus, and 24 for toolbars and navigation. The icons
					are tuned to line up with the screen’s pixels at those three sizes, so
					they look crisp there. Other sizes work too.
				</Prose>
				<Preview>
					{[16, 20, 24, 32, 48].map((size) => (
						<Sample key={size} label={`${size}px`}>
							<Icon icon="square-pen" size={size} />
						</Sample>
					))}
				</Preview>
			</Section>

			<Section id="color" title="Color">
				<Prose>
					Icons take the text color of whatever they sit in, so you rarely set a
					color at all. When you do need one, pass <code>color</code>.
				</Prose>
				<Preview className="items-center">
					<p className="flex items-center gap-2 text-label text-muted-foreground">
						<Icon icon="clock" size={16} /> Updated 2 hours ago
					</p>
					<Icon icon="heart" variant="bold" color="#e11d48" />
				</Preview>
				<CodeBlock code={colorCode} label="color example" />
				<Callout tone="tip">
					Changing the line weight with <code>strokeWidth</code> works, but the
					icons are drawn for 1.8. Other weights can make details touch or look
					thin.
				</Callout>
			</Section>
		</DocsPage>
	);
}

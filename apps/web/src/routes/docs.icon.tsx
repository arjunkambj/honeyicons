import { Icon } from "@honeyicons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CodeBlock } from "@/components/code-block";
import {
	Callout,
	ParamField,
	Preview,
	Prose,
	Sample,
	Section,
} from "@/components/docs/blocks";
import { DocsPage } from "@/components/docs/docs-page";

const toc = [
	{ id: "usage", label: "Usage" },
	{ id: "names-in-your-props", label: "Names in your own props" },
	{ id: "props", label: "Props" },
] as const;

const usageCode = `import { Icon } from "@honeyicons/react";

<Icon icon="bell" />
<Icon icon="bell" variant="bold" />
<Icon icon="bell" size={32} />
<Icon icon="bell" color="#65a30d" />`;

const iconNameCode = `import { Icon, type IconName } from "@honeyicons/react";

type MenuItem = { label: string; icon: IconName };

function MenuRow({ label, icon }: MenuItem) {
  return (
    <li>
      <Icon icon={icon} size={16} />
      {label}
    </li>
  );
}`;

export const Route = createFileRoute("/docs/icon")({
	head: () => ({
		meta: [
			{ title: "Icon component · Honeyicons docs" },
			{
				name: "description",
				content:
					"Render any Honeyicons icon by name, and every prop the Icon component takes.",
			},
		],
	}),
	component: IconComponentPage,
});

function IconComponentPage() {
	return (
		<DocsPage
			title="Icon component"
			description="Icon draws any icon in the set by its name. TypeScript knows every name, so a typo shows up in your editor before anyone sees a broken page."
			toc={toc}
		>
			<Section id="usage" title="Usage">
				<Preview>
					<Sample label="default">
						<Icon icon="bell" />
					</Sample>
					<Sample label="bold">
						<Icon icon="bell" variant="bold" />
					</Sample>
					<Sample label="size 32">
						<Icon icon="bell" size={32} />
					</Sample>
					<Sample label="#65a30d">
						<Icon icon="bell" color="#65a30d" />
					</Sample>
				</Preview>
				<CodeBlock code={usageCode} title="usage.tsx" />
			</Section>

			<Section id="names-in-your-props" title="Names in your own props">
				<Prose>
					When a component takes an icon as a prop, type it with{" "}
					<code>IconName</code>. Callers get the same autocomplete and the same
					checks.
				</Prose>
				<CodeBlock code={iconNameCode} title="menu-row.tsx" />
			</Section>

			<Section id="props" title="Props">
				<div>
					<ParamField name="icon" type="IconName" required>
						The icon’s name in kebab case, like <code>bell</code> or{" "}
						<code>square-pen</code>. A name that isn’t in the set throws an
						error instead of quietly drawing nothing.
					</ParamField>
					<ParamField
						name="variant"
						type={`"linear" | "bold"`}
						defaultValue={`"linear"`}
					>
						The drawing style. TypeScript only accepts styles the icon has.
					</ParamField>
					<ParamField name="size" type="number | string" defaultValue="24">
						Width and height. Numbers are pixels. 16, 20, and 24 keep lines
						sharpest.
					</ParamField>
					<ParamField
						name="color"
						type="string"
						defaultValue={`"currentColor"`}
					>
						The icon’s color. Leave it out and the icon matches the text around
						it. Icons ending in <code>-color</code> keep their brand colors.
					</ParamField>
					<ParamField name="strokeWidth" type="number" defaultValue="1.8">
						Line weight for icons drawn with lines. Icons drawn as filled shapes
						ignore it.
					</ParamField>
					<ParamField name="title" type="string">
						A name for screen readers. Add it when the icon means something on
						its own. See{" "}
						<Link
							className="text-foreground underline underline-offset-4"
							to="/docs/accessibility"
						>
							Accessibility
						</Link>
						.
					</ParamField>
				</div>
				<Callout tone="note">
					Icon also passes on any other SVG prop, such as <code>className</code>
					, <code>style</code>, <code>onClick</code>, and <code>aria-*</code>,
					and forwards a ref to the <code>&lt;svg&gt;</code>.
				</Callout>
			</Section>
		</DocsPage>
	);
}

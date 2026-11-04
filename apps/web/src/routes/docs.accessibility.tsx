import { Icon } from "@honeyicons/react";
import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/components/code-block";
import { Callout, Preview, Prose, Section } from "@/components/docs/blocks";
import { DocsPage } from "@/components/docs/docs-page";

const toc = [
	{ id: "decorative", label: "Icons next to text" },
	{ id: "icon-buttons", label: "Icon-only buttons" },
	{ id: "standalone", label: "Icons that stand alone" },
] as const;

const decorativeCode = `<button type="button">
  <Icon icon="trash" size={16} />
  Delete
</button>`;

const buttonCode = `<button type="button" aria-label="Notifications">
  <Icon icon="bell" size={20} />
</button>`;

const titleCode = `<Icon icon="verified-check" title="Verified account" />`;

export const Route = createFileRoute("/docs/accessibility")({
	head: () => ({
		meta: [
			{ title: "Accessibility · Honeyicons docs" },
			{
				name: "description",
				content: "Make icons work for people using screen readers.",
			},
		],
	}),
	component: AccessibilityPage,
});

function AccessibilityPage() {
	return (
		<DocsPage
			title="Accessibility"
			description="Screen readers skip icons unless you give them a name. That’s right most of the time. Here are the two cases where you need to add one."
			toc={toc}
		>
			<Section id="decorative" title="Icons next to text">
				<Prose>
					When a label sits beside the icon, the label already says what the
					button does. Leave the icon as it is and screen readers read only the
					label.
				</Prose>
				<Preview className="items-center">
					<span className="inline-flex h-9 items-center gap-2 rounded-full bg-destructive/10 px-4 font-medium text-destructive text-sm">
						<Icon icon="trash" size={16} />
						Delete
					</span>
				</Preview>
				<CodeBlock code={decorativeCode} label="example" />
			</Section>

			<Section id="icon-buttons" title="Icon-only buttons">
				<Prose>
					A button with only an icon has no words to read out. Put an{" "}
					<code>aria-label</code> on the button that says what it does.
				</Prose>
				<Preview className="items-center">
					<button
						type="button"
						aria-label="Notifications"
						className="inline-flex size-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-foreground/10"
					>
						<Icon icon="bell" size={20} />
					</button>
				</Preview>
				<CodeBlock code={buttonCode} label="example" />
			</Section>

			<Section id="standalone" title="Icons that stand alone">
				<Prose>
					Some icons carry meaning with no text nearby, like a check mark next
					to a name. Give those a <code>title</code>. Screen readers read it,
					and mouse users see it on hover.
				</Prose>
				<Preview className="items-center">
					<span className="flex items-center gap-1.5 font-medium text-sm">
						Maya Chen
						<Icon
							icon="verified-check"
							size={16}
							variant="bold"
							title="Verified account"
							className="text-sky-500"
						/>
					</span>
				</Preview>
				<CodeBlock code={titleCode} label="example" />
				<Callout tone="tip">
					Name what happens, not what the icon looks like. “Delete draft” helps
					someone using a screen reader. “Trash icon” doesn’t.
				</Callout>
			</Section>
		</DocsPage>
	);
}

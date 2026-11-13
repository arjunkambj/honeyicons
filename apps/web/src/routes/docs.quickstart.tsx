import { Icon } from "@honeyicons/react";
import { Button } from "@honeyicons/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Callout,
	Preview,
	Prose,
	Section,
	Step,
	Steps,
} from "@/components/docs/blocks";
import { DocsPage } from "@/components/docs/docs-page";
import { CodeBlock } from "@/components/code-block";
import { InstallCommand } from "@/components/install-command";

const toc = [{ id: "steps", label: "Three steps" }] as const;

const firstIconCode = `import { Icon } from "@honeyicons/react";

export function NotificationsButton() {
  return (
    <button type="button">
      <Icon icon="bell" size={20} />
      Notifications
    </button>
  );
}`;

export const Route = createFileRoute("/docs/quickstart")({
	head: () => ({
		meta: [
			{ title: "Quickstart · Honeyicons docs" },
			{
				name: "description",
				content:
					"Install @honeyicons/react and render your first icon in a few minutes.",
			},
		],
	}),
	component: Quickstart,
});

function Quickstart() {
	return (
		<DocsPage
			title="Quickstart"
			description="Install the package, render an icon, and find the rest in the catalog. It takes about two minutes."
			toc={toc}
		>
			<Callout tone="note">
				Working with Claude Code, Cursor, or Codex?{" "}
				<Link to="/docs/agents">Agent setup</Link> does all of this from one
				prompt.
			</Callout>
			<Section id="steps" title="Three steps">
				<Steps>
					<Step number={1} title="Install the package">
						<Prose>Use the package manager your project already uses.</Prose>
						<InstallCommand />
					</Step>
					<Step number={2} title="Render an icon">
						<Prose>
							Import <code>Icon</code> and pass it an icon name. Your editor
							suggests names as you type, and a name that doesn’t exist shows up
							as a type error.
						</Prose>
						<CodeBlock code={firstIconCode} title="notifications-button.tsx" />
						<Preview className="min-h-20 items-center">
							<span className="inline-flex h-10 items-center gap-2 rounded-full bg-muted px-4 font-medium text-label">
								<Icon icon="bell" size={20} />
								Notifications
							</span>
						</Preview>
					</Step>
					<Step number={3} title="Find the rest" last>
						<Prose>
							Search the catalog by name or by what an icon shows, like “trash”
							or “upload”. Click an icon to see its code, then copy it.
						</Prose>
						<div>
							<Button nativeButton={false} render={<Link to="/icons" />}>
								Browse icons
							</Button>
						</div>
					</Step>
				</Steps>
			</Section>
		</DocsPage>
	);
}

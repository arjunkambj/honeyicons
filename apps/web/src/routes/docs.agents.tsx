import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock, CopyButton } from "@/components/code-block";
import { Callout, Prose, Section } from "@/components/docs/blocks";
import { DocsPage } from "@/components/docs/docs-page";
import { setupPrompt } from "@/lib/setup-prompt";

const toc = [
	{ id: "setup-prompt", label: "Setup prompt" },
	{ id: "skill", label: "Skill only" },
	{ id: "llms-txt", label: "llms.txt" },
] as const;

export const Route = createFileRoute("/docs/agents")({
	head: () => ({
		meta: [
			{ title: "Agent setup · Honeyicons docs" },
			{
				name: "description",
				content:
					"Set up Honeyicons with Claude Code, Cursor, Codex, or another coding agent from one prompt.",
			},
		],
	}),
	component: AgentSetup,
});

function AgentSetup() {
	return (
		<DocsPage
			title="Agent setup"
			description="Paste one prompt into your coding agent. It installs the package and the Honeyicons skill, then checks that an icon renders."
			toc={toc}
		>
			<Section id="setup-prompt" title="Setup prompt">
				<Prose>
					This works in Claude Code, Cursor, Codex, and any other agent that can
					read a web page and run commands.
				</Prose>
				<div className="flex flex-col gap-2 surface rounded-2xl py-2 pr-2 pl-4 sm:flex-row sm:items-center sm:py-1.5 sm:pr-1.5">
					<p className="min-w-0 flex-1 wrap-anywhere font-mono text-sm leading-6">
						{setupPrompt}
					</p>
					<CopyButton
						text={setupPrompt}
						label="Copy setup prompt"
						className="self-start sm:self-auto"
					>
						Copy prompt
					</CopyButton>
				</div>
			</Section>

			<Section id="skill" title="Skill only">
				<Prose>
					Already have the package? Add just the skill. It lets your agent look
					up real icon names before writing code, so it doesn’t make up names
					that don’t exist.
				</Prose>
				<CodeBlock
					code="npx skills add arjunkambj/honeyicons"
					title="Terminal"
				/>
			</Section>

			<Section id="llms-txt" title="llms.txt">
				<Prose>
					<code>/llms.txt</code> is a short plain-text guide with the install
					command, real examples, and the rules for using the icons. Point any
					agent or chat at it when you want answers about Honeyicons.
				</Prose>
				<Callout tone="tip">
					Open <a href="/llms.txt">llms.txt</a> to see exactly what your agent
					will read.
				</Callout>
			</Section>
		</DocsPage>
	);
}

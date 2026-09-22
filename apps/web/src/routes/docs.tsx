import { Icon } from "@honeyicons/react";
import { Button } from "@honeyicons/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { DocumentationLayout } from "@/components/documentation-layout";
import { CodeBlock, CopyButton } from "@/components/code-block";
import { InstallCommand } from "@/components/install-command";
import { PageActions, PageHeader } from "@/components/page-header";
import { setupPrompt } from "@/lib/setup-prompt";

const usageCode = `import { Icon, type IconName } from "@honeyicons/react";

<Icon icon="bell" size={24} />
<Icon icon="search" size={16} />
<Icon icon="square-pen" size={24} />

function NavIcon({ name }: { name: IconName }) {
  return <Icon icon={name} size={16} />;
}`;

const accessibilityCode = `import { Icon } from "@honeyicons/react";

<button type="button" aria-label="Notifications">
  <Icon icon="bell" size={20} />
</button>

<Icon icon="search" size={24} title="Search" />`;

const propsCode = `import { Icon } from "@honeyicons/react";

<Icon icon="bell" size={16} />
<Icon icon="bell" size={24} />
<Icon icon="bell" color="#3b82f6" />
<Icon icon="search" strokeWidth={1.8} />
<Icon icon="moon" variant="bold" />`;

const skillCode = "npx skills add arjunkambj/honeyicons";

const sections = [
	{ id: "introduction", label: "Introduction" },
	{ id: "agent-skill", label: "Agent setup" },
	{ id: "install", label: "Install" },
	{ id: "usage", label: "Usage" },
	{ id: "props", label: "Props" },
	{ id: "accessibility", label: "Accessibility" },
	{ id: "catalog", label: "Catalog" },
] as const;

const usagePreview = [
	{ icon: "bell", size: 24 },
	{ icon: "search", size: 16 },
	{ icon: "square-pen", size: 24 },
] as const;

export const Route = createFileRoute("/docs")({
	head: () => ({
		meta: [
			{ title: "Docs · honeyicons" },
			{
				name: "description",
				content:
					"Install Honeyicons in a React app, render icons by name, and set their size and color.",
			},
		],
	}),
	component: DocsPage,
});

function DocsPage() {
	return (
		<DocumentationLayout page="docs" sections={sections}>
			<article className="mx-auto flex max-w-3xl flex-col gap-10 sm:gap-12">
				<PageHeader
					id="introduction"
					eyebrow="Documentation"
					title="React"
					description="Install the package, render icons by name, and set their size. Icons use the current text color."
				/>
				<section
					id="agent-skill"
					aria-labelledby="agent-skill-title"
					className="scroll-mt-24"
				>
					<h2
						id="agent-skill-title"
						className="font-semibold text-2xl leading-snug tracking-tight"
					>
						Set up with an agent
					</h2>
					<p className="mt-2 text-sm text-muted-foreground leading-6">
						Copy this prompt into your coding agent. It reads the setup guide,
						installs the package and skill, and checks the result.
					</p>
					<div className="mt-5 flex items-start gap-3">
						<code className="min-w-0 flex-1 wrap-anywhere pt-1.5 font-mono text-sm leading-6 text-foreground">
							{setupPrompt}
						</code>
						<CopyButton
							text={setupPrompt}
							label="Copy agent setup prompt"
							className="size-9 shrink-0 rounded-xl"
						/>
					</div>
					<p className="mt-4 text-sm text-muted-foreground leading-6">
						Already installed the package? Add the skill on its own:
					</p>
					<CodeBlock
						code={skillCode}
						label="skill install command"
						className="mt-3"
					/>
				</section>
				<DocsSection
					id="install"
					title="Install"
					description="Add the package with pnpm, npm, yarn, or bun."
				>
					<InstallCommand layout="panel" className="mt-6" />
					<p className="mt-3 text-muted-foreground text-sm leading-6">
						The <code>$</code> is the shell prompt and isn’t copied.
					</p>
				</DocsSection>
				<DocsSection
					id="usage"
					title="Usage"
					description="Pass the icon’s kebab-case name to Icon. TypeScript checks names and variants, and an unknown name throws an error. Type your own props with IconName."
				>
					<CodeBlock code={usageCode} className="mt-6" />
					<p className="mt-3 text-muted-foreground text-sm leading-6">
						Icon includes the whole collection. For fixed icons, use named
						imports such as {`import { Bell } from "@honeyicons/react"`} and{" "}
						{"<Bell />"}
						so your bundler can remove unused icons.
					</p>
					<div className="mt-3 flex flex-wrap items-end gap-8 rounded-2xl bg-card px-5 py-4">
						{usagePreview.map(({ icon, size }) => (
							<figure
								key={icon}
								className="flex min-w-16 flex-col items-center gap-2"
							>
								<Icon icon={icon} size={size} title={icon} />
								<figcaption className="font-mono text-muted-foreground text-xs">
									{icon} {size}
								</figcaption>
							</figure>
						))}
					</div>
				</DocsSection>
				<DocsSection
					id="props"
					title="Props"
					description="Every icon is drawn on a 24 × 24 grid with a 1.8 stroke and uses the current text color. Icons that have a bold version accept the bold variant."
				>
					<CodeBlock code={propsCode} className="mt-6" />
					<div className="mt-3 flex flex-wrap items-end gap-8 rounded-2xl bg-card px-5 py-4">
						<SizeSample size={16} />
						<SizeSample size={24} />
						<figure className="flex flex-col items-center gap-2 text-foreground">
							<Icon icon="bell" size={24} />
							<figcaption className="font-mono text-muted-foreground text-xs">
								Inherited
							</figcaption>
						</figure>
						<figure className="flex flex-col items-center gap-2">
							<Icon icon="bell" size={24} color="#3b82f6" />
							<figcaption className="font-mono text-muted-foreground text-xs">
								#3b82f6
							</figcaption>
						</figure>
						<StrokeSample width={1.8} />
						<VariantSample variant="bold" />
					</div>
				</DocsSection>
				<DocsSection
					id="accessibility"
					title="Accessibility"
					description="Screen readers skip icons by default. Put an aria-label on icon-only buttons, or give an icon a title when it needs to be read out on its own."
				>
					<CodeBlock code={accessibilityCode} className="mt-6" />
					<div className="mt-3 flex flex-wrap items-center gap-6 rounded-2xl bg-card px-5 py-4">
						<button
							type="button"
							aria-label="Notifications"
							className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-background transition-colors hover:bg-muted"
						>
							<Icon icon="bell" size={20} />
						</button>
						<Icon icon="search" size={24} title="Search" />
						<p className="text-muted-foreground text-sm">
							An icon-only button with an aria-label, then an icon with a title.
						</p>
					</div>
				</DocsSection>
				<DocsSection
					id="catalog"
					title="Catalog"
					description="Search by name or keyword, then click an icon to copy its code."
				>
					<PageActions>
						<Button nativeButton={false} render={<Link to="/icons" />}>
							Explore icons
						</Button>
						<Button
							variant="outline"
							nativeButton={false}
							render={<a href="/llms.txt" />}
						>
							AI context
						</Button>
						<Button
							variant="ghost"
							nativeButton={false}
							render={<a href="/credits.txt" />}
						>
							Licenses &amp; credits
						</Button>
					</PageActions>
				</DocsSection>
			</article>
		</DocumentationLayout>
	);
}

function DocsSection({
	id,
	title,
	description,
	children,
}: {
	id: string;
	title: string;
	description: string;
	children: ReactNode;
}) {
	return (
		<section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
			<h2
				id={`${id}-title`}
				className="font-semibold text-2xl leading-snug tracking-tight"
			>
				{title}
			</h2>
			<p className="mt-2 text-muted-foreground leading-7">{description}</p>
			{children}
		</section>
	);
}

function SizeSample({ size }: { size: number }) {
	return (
		<figure className="flex flex-col items-center gap-2">
			<Icon icon="bell" size={size} title={`${size} pixels`} />
			<figcaption className="font-mono text-muted-foreground text-xs">
				{size}
			</figcaption>
		</figure>
	);
}

function StrokeSample({ width }: { width: number }) {
	return (
		<figure className="flex flex-col items-center gap-2">
			<Icon
				icon="search"
				size={24}
				strokeWidth={width}
				title={`Stroke ${width}`}
			/>
			<figcaption className="font-mono text-muted-foreground text-xs">
				{width}
			</figcaption>
		</figure>
	);
}

function VariantSample({ variant }: { variant: "linear" | "bold" }) {
	return (
		<figure className="flex flex-col items-center gap-2">
			<Icon icon="moon" size={24} variant={variant} title={`${variant} moon`} />
			<figcaption className="font-mono text-muted-foreground text-xs">
				{variant}
			</figcaption>
		</figure>
	);
}

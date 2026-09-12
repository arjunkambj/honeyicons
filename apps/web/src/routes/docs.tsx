import { Bell, Moon, Search, SquarePen } from "@honeyicons/react";
import { Button } from "@honeyicons/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { DocumentationLayout } from "@/components/documentation-layout";
import { CodeBlock } from "@/components/code-block";
import { InstallCommand } from "@/components/install-command";

const usageCode = `import { Bell, Search, SquarePen } from "@honeyicons/react";

<Bell size={24} />
<Search size={16} />
<SquarePen size={24} />`;

const accessibilityCode = `import { Bell, Search } from "@honeyicons/react";

<button type="button" aria-label="Notifications">
  <Bell size={20} />
</button>

<Search size={24} title="Search" />`;

const sections = [
	{ id: "introduction", label: "Introduction" },
	{ id: "install", label: "Install" },
	{ id: "usage", label: "Usage" },
	{ id: "props", label: "Props" },
	{ id: "accessibility", label: "Accessibility" },
	{ id: "catalog", label: "Catalog" },
] as const;

const usagePreview = [
	{ Icon: Bell, name: "Bell", size: 24 },
	{ Icon: Search, name: "Search", size: 16 },
	{ Icon: SquarePen, name: "SquarePen", size: 24 },
] as const;

export const Route = createFileRoute("/docs")({
	head: () => ({
		meta: [
			{ title: "Docs · honeyicons" },
			{
				name: "description",
				content:
					"Install Honeyicons in React, import icons by name, and size them for 16px and 24px interfaces.",
			},
		],
	}),
	component: DocsPage,
});

function DocsPage() {
	return (
		<DocumentationLayout page="docs" sections={sections}>
			<article className="mx-auto flex max-w-3xl flex-col">
				<header
					id="introduction"
					className="mb-8 scroll-mt-40 sm:mb-10 sm:scroll-mt-28"
				>
					<p className="mb-3 text-muted-foreground text-sm">Documentation</p>
					<h1 className="font-heading font-medium text-4xl leading-tight tracking-tight sm:text-5xl">
						React
					</h1>
					<p className="mt-4 max-w-xl text-muted-foreground leading-7">
						Install the package, import icons by name, and size them for 16px
						and 24px interfaces. Color follows your UI.
					</p>
				</header>
				<DocsSection
					id="install"
					title="Install"
					description="Add the React package with pnpm, npm, or bun."
				>
					<InstallCommand layout="panel" className="mt-6" />
				</DocsSection>
				<DocsSection
					id="usage"
					title="Usage"
					description="Import only the icons you need. Named imports tree-shake."
				>
					<CodeBlock code={usageCode} className="mt-6" />
					<div className="mt-3 flex flex-wrap items-end gap-8 rounded-2xl bg-muted/60 px-5 py-4">
						{usagePreview.map(({ Icon, name, size }) => (
							<figure
								key={name}
								className="flex min-w-16 flex-col items-center gap-2"
							>
								<Icon size={size} title={name} />
								<figcaption className="font-mono text-muted-foreground text-xs">
									{name} {size}
								</figcaption>
							</figure>
						))}
					</div>
				</DocsSection>
				<DocsSection
					id="props"
					title="Props"
					description="Icons share a 24-unit grid, inherit currentColor, and default to a 1.5-unit stroke."
				>
					<div className="mt-6 grid gap-3 sm:grid-cols-2">
						<PropCard
							title="Size"
							description="Defaults to 24. Use 16 for compact controls."
						>
							<div className="flex items-end gap-6">
								<SizeSample size={16} />
								<SizeSample size={24} />
							</div>
						</PropCard>
						<PropCard
							title="Color"
							description="Inherits currentColor. Set a text color or the color prop."
						>
							<div className="flex flex-wrap items-end gap-6">
								<figure className="flex flex-col items-center gap-2 text-foreground">
									<Bell size={24} />
									<figcaption className="font-mono text-muted-foreground text-xs">
										Inherited
									</figcaption>
								</figure>
								<figure className="flex flex-col items-center gap-2">
									<Bell size={24} color="#3b82f6" />
									<figcaption className="font-mono text-muted-foreground text-xs">
										#3b82f6
									</figcaption>
								</figure>
								<figure className="flex flex-col items-center gap-2">
									<Bell size={24} color="#f97316" />
									<figcaption className="font-mono text-muted-foreground text-xs">
										#f97316
									</figcaption>
								</figure>
							</div>
							<code className="mt-4 block text-xs">
								{'<Bell color="#3b82f6" />'}
							</code>
						</PropCard>
						<PropCard
							title="Stroke"
							description="The default is 1.5. Filled outlines keep their baked-in weight."
						>
							<div className="flex items-end gap-6">
								<StrokeSample width={1} />
								<StrokeSample width={1.5} />
								<StrokeSample width={2} />
							</div>
						</PropCard>
						<PropCard
							title="Variant"
							description="Linear is the default. Check an icon’s variants before using bold."
						>
							<div className="flex items-end gap-6">
								<VariantSample variant="linear" />
								<VariantSample variant="bold" />
							</div>
						</PropCard>
					</div>
				</DocsSection>
				<DocsSection
					id="accessibility"
					title="Accessibility"
					description="Icons are decorative by default. Name the control, or give a standalone icon a title."
				>
					<CodeBlock code={accessibilityCode} className="mt-6" />
					<div className="mt-3 flex flex-wrap items-center gap-6 rounded-2xl bg-muted/60 px-5 py-4">
						<button
							type="button"
							aria-label="Notifications"
							className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted"
						>
							<Bell size={20} />
						</button>
						<Search size={24} title="Search" />
						<p className="text-muted-foreground text-sm">
							Icon-only button, then a labeled image.
						</p>
					</div>
				</DocsSection>
				<DocsSection
					id="catalog"
					title="Catalog"
					description="Search by name or keyword, then click an icon to copy its React snippet."
				>
					<div className="mt-6 flex flex-wrap gap-3">
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
					</div>
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
		<section
			id={id}
			aria-labelledby={`${id}-title`}
			className="scroll-mt-44 py-10 sm:scroll-mt-32 sm:py-12"
		>
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

function PropCard({
	title,
	description,
	children,
}: {
	title: string;
	description: string;
	children: ReactNode;
}) {
	return (
		<div className="rounded-2xl bg-muted/60 p-5">
			<h3 className="font-medium">{title}</h3>
			<p className="mt-1 text-muted-foreground text-sm leading-6">
				{description}
			</p>
			<div className="mt-4">{children}</div>
		</div>
	);
}

function SizeSample({ size }: { size: number }) {
	return (
		<figure className="flex flex-col items-center gap-2">
			<Bell size={size} title={`${size} pixels`} />
			<figcaption className="font-mono text-muted-foreground text-xs">
				{size}
			</figcaption>
		</figure>
	);
}

function StrokeSample({ width }: { width: number }) {
	return (
		<figure className="flex flex-col items-center gap-2">
			<Search size={24} strokeWidth={width} title={`Stroke ${width}`} />
			<figcaption className="font-mono text-muted-foreground text-xs">
				{width}
			</figcaption>
		</figure>
	);
}

function VariantSample({ variant }: { variant: "linear" | "bold" }) {
	return (
		<figure className="flex flex-col items-center gap-2">
			<Moon size={24} variant={variant} title={`${variant} moon`} />
			<figcaption className="font-mono text-muted-foreground text-xs">
				{variant}
			</figcaption>
		</figure>
	);
}

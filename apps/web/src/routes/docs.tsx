import { Bell, Search, SquarePen } from "@honeyicons/react";
import { Button } from "@honeyicons/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { InstallCommand } from "@/components/install-command";

export const Route = createFileRoute("/docs")({
	head: () => ({
		meta: [
			{ title: "Docs · honeyicons" },
			{
				name: "description",
				content:
					"Use Honeyicons in React with typed imports, consistent sizing, and theme support.",
			},
		],
	}),
	component: DocsPage,
});

function DocsPage() {
	return (
		<main className="container mx-auto px-4 py-10 sm:px-6 sm:py-16">
			<article className="mx-auto flex max-w-3xl flex-col">
				<header className="mb-12 sm:mb-16">
					<p className="mb-3 text-muted-foreground text-sm">Documentation</p>
					<h1 className="font-semibold text-4xl leading-tight tracking-tight sm:text-5xl">
						Make room for the details.
					</h1>
					<p className="mt-4 max-w-xl text-muted-foreground leading-7">
						Use Honeyicons in React with named imports, typed props, and colors
						that follow your interface.
					</p>
				</header>
				<section aria-labelledby="installation">
					<h2
						id="installation"
						className="font-semibold text-2xl leading-snug tracking-tight"
					>
						Get started
					</h2>
					<p className="mt-2 text-muted-foreground leading-7">
						Add the React package to your project, then import the icons you
						need.
					</p>
					<InstallCommand />
					<pre className="mt-3 overflow-x-auto rounded-xl bg-muted p-5 text-sm leading-7">
						<code>
							{
								'import { Bell, Search, SquarePen } from "@honeyicons/react";\n\n<Bell size={24} />\n<Search size={16} />\n<SquarePen size={24} />'
							}
						</code>
					</pre>
					<div className="mt-3 flex items-center gap-6">
						<Bell size={24} title="Bell" />
						<Search size={16} title="Search" />
						<SquarePen size={24} title="Compose" />
					</div>
				</section>
				<section aria-labelledby="customization" className="mt-16 sm:mt-20">
					<h2
						id="customization"
						className="font-semibold text-2xl leading-snug tracking-tight"
					>
						Designed to fit
					</h2>
					<dl className="mt-6 grid gap-x-10 gap-y-6 text-sm leading-6 sm:grid-cols-2">
						<div>
							<dt className="font-medium">Size</dt>
							<dd className="mt-1 text-muted-foreground">
								Defaults to 24px. Use 16px for compact controls and 24px for
								standard interfaces.
							</dd>
						</div>
						<div>
							<dt className="font-medium">Color</dt>
							<dd className="mt-1 text-muted-foreground">
								Icons inherit currentColor. Use a text color class or the color
								prop to match your theme.
							</dd>
						</div>
						<div>
							<dt className="font-medium">Stroke</dt>
							<dd className="mt-1 text-muted-foreground">
								The default is 1.5 units. Filled outlines preserve their
								original geometry and do not respond to stroke width.
							</dd>
						</div>
						<div>
							<dt className="font-medium">Accessibility</dt>
							<dd className="mt-1 text-muted-foreground">
								Icons are decorative by default. Add a title to label an image,
								or an aria-label to an icon-only button.
							</dd>
						</div>
					</dl>
				</section>
				<section aria-labelledby="catalog" className="mt-12 sm:mt-16">
					<h2
						id="catalog"
						className="font-semibold text-2xl leading-snug tracking-tight"
					>
						Find the right icon
					</h2>
					<p className="mt-2 text-muted-foreground leading-7">
						Search the catalog by name or keyword, choose a category, and click
						an icon to copy its React snippet. Linear is the default style;
						available variants are listed in the catalog.
					</p>
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
				</section>
			</article>
		</main>
	);
}

import { Card, Clock, Key, UserAdd, Wallet } from "@honeyicons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DocumentationLayout } from "@/components/documentation-layout";

const sections = [
	{ id: "september-12-title", label: "Five new icons" },
	{ id: "refinements", label: "Refinements" },
] as const;

const addedIcons = [
	{
		name: "Wallet",
		Icon: Wallet,
		description: "A wallet with cash tucked inside.",
	},
	{
		name: "Clock",
		Icon: Clock,
		description: "Time, schedules, and recent activity.",
	},
	{ name: "Key", Icon: Key, description: "Access, passwords, and security." },
	{
		name: "UserAdd",
		Icon: UserAdd,
		description: "Invite someone or create an account.",
	},
	{ name: "Card", Icon: Card, description: "Cards, billing, and payments." },
] as const;

export const Route = createFileRoute("/changelog")({
	head: () => ({
		meta: [
			{ title: "Changelog · honeyicons" },
			{
				name: "description",
				content:
					"New icons and improvements to Honeyicons. Follow the latest additions to the collection.",
			},
		],
	}),
	component: ChangelogPage,
});

function ChangelogPage() {
	return (
		<DocumentationLayout page="changelog" sections={sections}>
			<div className="mx-auto flex max-w-3xl flex-col gap-10 sm:gap-12">
				<header>
					<p className="mb-3 text-muted-foreground text-sm">What’s new</p>
					<h1 className="font-heading font-medium text-4xl leading-tight tracking-tight sm:text-5xl">
						Changelog
					</h1>
					<p className="mt-4 text-muted-foreground leading-7">
						New icons and small improvements to the collection.
					</p>
				</header>
				<article
					aria-labelledby="september-12-title"
					className="border-t border-border pt-8"
				>
					<time dateTime="2026-09-12" className="text-muted-foreground text-sm">
						September 12, 2026
					</time>
					<h2
						id="september-12-title"
						className="mt-3 scroll-mt-24 font-semibold text-2xl leading-snug tracking-tight"
					>
						Five new icons
					</h2>
					<p className="mt-3 text-muted-foreground leading-7">
						Wallet, Clock, Key, UserAdd, and Card join the linear collection.
						Built for everyday actions, accounts, and payments.
					</p>
					<ul className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2">
						{addedIcons.map(({ name, Icon, description }) => (
							<li key={name} className="flex flex-col gap-3">
								<div className="flex h-24 items-center justify-center gap-8 rounded-2xl bg-card">
									{[16, 24].map((size) => (
										<figure
											key={size}
											className="flex min-w-8 flex-col items-center gap-2"
										>
											<Icon size={size} />
											<figcaption className="font-mono text-muted-foreground text-xs">
												{size}px
											</figcaption>
										</figure>
									))}
								</div>
								<div>
									<h3 className="font-mono text-sm">{name}</h3>
									<p className="mt-1 text-muted-foreground text-sm leading-6">
										{description}
									</p>
								</div>
							</li>
						))}
					</ul>
					<h3 id="refinements" className="mt-10 scroll-mt-24 font-medium">
						Refinements
					</h3>
					<ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-muted-foreground leading-7">
						<li>
							Wallet now uses the money-wallet design, with cash visible above
							the opening.
						</li>
						<li>
							All five icons use currentColor and the standard 24-unit grid,
							reviewed at 16px and 24px in light and dark themes.
						</li>
					</ul>
					<Link
						to="/icons"
						className="mt-8 inline-block text-sm underline underline-offset-4"
					>
						Explore the icons
					</Link>
				</article>
			</div>
		</DocumentationLayout>
	);
}

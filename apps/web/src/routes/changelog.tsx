import {
	Bot,
	Card,
	ChartPie,
	Clock,
	CloudRain,
	Film,
	Heading1,
	Key,
	Laptop,
	Receipt,
	Snowflake,
	Trophy,
	UserAdd,
	Wallet,
	Webhook,
} from "@honeyicons/react";
import { Button } from "@honeyicons/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DocumentationLayout } from "@/components/documentation-layout";
import { PageActions, PageHeader } from "@/components/page-header";

const sections = [
	{ id: "version-007", label: "0.0.7 · Bold for every icon" },
	{ id: "version-006", label: "0.0.6 · Even overlaps" },
	{ id: "version-005", label: "0.0.5 · Named icons" },
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

const version007Highlights = [
	{ name: "CloudRain", Icon: CloudRain },
	{ name: "Snowflake", Icon: Snowflake },
	{ name: "Bot", Icon: Bot },
	{ name: "ChartPie", Icon: ChartPie },
	{ name: "Receipt", Icon: Receipt },
	{ name: "Webhook", Icon: Webhook },
	{ name: "Laptop", Icon: Laptop },
	{ name: "Heading1", Icon: Heading1 },
	{ name: "Film", Icon: Film },
	{ name: "Trophy", Icon: Trophy },
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
			<article className="mx-auto flex max-w-3xl flex-col gap-10 sm:gap-12">
				<PageHeader
					eyebrow="What’s new"
					title="Changelog"
					description="New icons and small improvements to the collection."
				/>
				<section
					aria-labelledby="version-007"
					className="border-t border-border pt-8"
				>
					<time dateTime="2026-09-24" className="text-muted-foreground text-sm">
						September 24, 2026
					</time>
					<h2
						id="version-007"
						className="mt-3 scroll-mt-36 xl:scroll-mt-24 font-semibold text-2xl leading-snug tracking-tight"
					>
						0.0.7 · Bold for every icon, 112 new icons, and a Weather category
					</h2>
					<ul className="mt-6 flex flex-wrap gap-2">
						{version007Highlights.map(({ name, Icon }) => (
							<li
								key={name}
								title={name}
								className="flex size-12 items-center justify-center rounded-xl bg-card"
							>
								<Icon size={24} aria-label={name} />
							</li>
						))}
					</ul>
					<ul className="mt-6 flex list-disc flex-col gap-2 pl-5 text-muted-foreground leading-7">
						<li>
							Every icon now has a bold variant. Bold fills each shape and cuts
							its inner lines all the way through, so dividers, folds, and lids
							read as separate pieces.
						</li>
						<li>
							Every brand logo ships in both linear and bold. Solid marks use
							the same drawing in each.
						</li>
						<li>
							108 icons fill gaps across editor, media, files, devices, actions,
							and the other categories, including headings, playback controls,
							file types, git, charts, and commerce.
						</li>
						<li>
							A new Weather category adds CloudRain, Droplet, Snowflake, and
							Wind.
						</li>
						<li>
							Off, remove, lock, and search variants such as PinOff, WifiOff,
							FolderLock, and UserSettings reuse the geometry of their base
							icons.
						</li>
						<li>
							54 existing icons are rebuilt at the standard 1.8-unit weight.
							Crop, Like, Dislike, and Key are redrawn.
						</li>
						<li>
							The user icons have a deeper bust with round shoulders and a flat
							base, and UserGroup’s side figures are open arcs.
						</li>
						<li>
							Icons align to the 1.2 and 22.8 keylines and to the pixel grid at
							16, 20, and 24 pixels.
						</li>
						<li>
							ExternalLink, ClipboardCheck, Camera, Sad, Sparkles, and List no
							longer draw their filled parts with an extra stroke. Barcode, Usb,
							Gamepad, Captions, Card, FileCode, Globe, and PhoneOff are tidied.
						</li>
					</ul>
				</section>
				<section
					aria-labelledby="version-006"
					className="border-t border-border pt-8"
				>
					<time dateTime="2026-09-23" className="text-muted-foreground text-sm">
						September 23, 2026
					</time>
					<h2
						id="version-006"
						className="mt-3 scroll-mt-36 xl:scroll-mt-24 font-semibold text-2xl leading-snug tracking-tight"
					>
						0.0.6 · Even rendering with translucent colors
					</h2>
					<ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-muted-foreground leading-7">
						<li>
							Overlapping parts in 78 icons are merged, so icons drawn in a
							translucent color no longer show darker seams where lines cross.
						</li>
						<li>
							The back card of ArchiveAlt now ends where it meets the front
							card.
						</li>
					</ul>
				</section>
				<section
					aria-labelledby="version-005"
					className="border-t border-border pt-8"
				>
					<time dateTime="2026-09-23" className="text-muted-foreground text-sm">
						September 23, 2026
					</time>
					<h2
						id="version-005"
						className="mt-3 scroll-mt-36 xl:scroll-mt-24 font-semibold text-2xl leading-snug tracking-tight"
					>
						0.0.5 · Named icons and agent setup
					</h2>
					<ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-muted-foreground leading-7">
						<li>
							Render icons by name with the typed Icon component. Named
							component imports remain available for smaller bundles.
						</li>
						<li>
							The package includes icons.json with names, exports, categories,
							variants, and search tags for all 324 icons, plus an installable
							agent skill in the repository.
						</li>
						<li>
							Catalog search, category, and style filters are saved in the URL.
							Search shortcuts and alignment guides make browsing easier.
						</li>
						<li>
							Breaking changes: deprecated aliases, duotone, and secondary color
							props are removed. Unsupported variants throw. Custom SVG nodes
							now use createIcon instead of Icon.
						</li>
						<li>
							Shapes are grouped under Objects &amp; Shapes; spinners are under
							Status.
						</li>
					</ul>
				</section>
				<section
					aria-labelledby="september-12-title"
					className="border-t border-border pt-8"
				>
					<time dateTime="2026-09-12" className="text-muted-foreground text-sm">
						September 12, 2026
					</time>
					<h2
						id="september-12-title"
						className="mt-3 scroll-mt-36 xl:scroll-mt-24 font-semibold text-2xl leading-snug tracking-tight"
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
					<h3
						id="refinements"
						className="mt-10 scroll-mt-36 xl:scroll-mt-24 font-medium"
					>
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
					<PageActions>
						<Button nativeButton={false} render={<Link to="/icons" />}>
							Explore icons
						</Button>
					</PageActions>
				</section>
			</article>
		</DocumentationLayout>
	);
}

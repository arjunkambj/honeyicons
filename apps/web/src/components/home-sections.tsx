import {
	Bell,
	Bookmark,
	Brain,
	ChevronRight,
	Code,
	Command,
	Copy,
	FileCode,
	FolderOpen,
	Github,
	ICON_CATEGORIES,
	Layers,
	Lightning,
	Lock,
	React as ReactIcon,
	Settings,
	SquarePen,
	Star,
	User,
	Widget,
} from "@honeyicons/react";
import { catalog } from "@honeyicons/react/catalog";
import { Button } from "@honeyicons/ui/components/button";
import { cn } from "@honeyicons/ui/lib/utils";
import { InstallCommand } from "@/components/install-command";
import styles from "@/components/marketing.module.css";

const sampleIcons = [
	SquarePen,
	Bell,
	FolderOpen,
	Code,
	Command,
	Layers,
	Star,
	Settings,
	Lock,
	Widget,
	Bookmark,
	User,
	Brain,
	Copy,
	Lightning,
];
export function Community() {
	return (
		<section
			id="community"
			className={styles.community}
			aria-labelledby="community-heading"
		>
			<div>
				<h2 id="community-heading" className={styles.sectionHeading}>
					Built for developers.
					<br />
					<span className="text-muted-foreground">Maintained with care.</span>
				</h2>
				<p className={styles.sectionDescription}>
					A thoughtful icon collection, a simple React API, and a growing set of
					tools to make building feel easier. Carefully considered details, from
					the first import to the finishing touches.
				</p>
				<dl className={styles.stats}>
					<div>
						<dt>Total icons</dt>
						<dd>{catalog.length}</dd>
					</div>
					<div>
						<dt>Categories</dt>
						<dd>{ICON_CATEGORIES.length}</dd>
					</div>
					<div>
						<dt>Design grid</dt>
						<dd>24 × 24</dd>
					</div>
				</dl>
			</div>
			<div className={styles.githubScene}>
				<div className={styles.githubWallpaper} aria-hidden="true">
					{sampleIcons.map((Icon) => (
						<Icon key={Icon.displayName} size={28} />
					))}
				</div>
				<Button
					variant="contrast"
					size="lg"
					className="z-1 px-5"
					nativeButton={false}
					aria-label="Star on GitHub"
					render={
						<a
							href="https://github.com/arjunkambj/honeyicons"
							target="_blank"
							rel="noreferrer"
						/>
					}
				>
					<Github data-icon="inline-start" />
					Star on GitHub
					<span className={styles.githubStar}>
						<Star />
					</span>
				</Button>
			</div>
		</section>
	);
}

export function AgentTools() {
	return (
		<section
			id="tools"
			className={cn(styles.tools, styles.gradientPanel)}
			aria-labelledby="tools-heading"
		>
			<div>
				<h2 id="tools-heading" className={styles.sectionHeading}>
					Give your agent
					<br />
					<span className="text-muted-foreground">the right icons.</span>
				</h2>
				<p className={styles.sectionDescription}>
					Start with React, then give your coding agent the context to choose
					the right icons and imports. Prefer plain SVG? It’s ready when you
					are.
				</p>
				<InstallCommand />
				<div className="mt-6">
					<Button
						variant="outline"
						size="lg"
						nativeButton={false}
						render={<a href="/llms.txt" />}
					>
						Explore AI context
						<ChevronRight data-icon="inline-end" />
					</Button>
				</div>
			</div>
			<div className={styles.toolList}>
				<div className={styles.toolItem}>
					<span className={styles.toolIcon}>
						<Brain size={22} />
					</span>
					<div>
						<h3 className={styles.toolName}>
							AI context <code>llms.txt</code>
						</h3>
						<p>
							A concise reference for coding agents, with real imports and usage
							rules.
						</p>
					</div>
				</div>
				<div className={styles.toolItem}>
					<span className={styles.toolIcon}>
						<ReactIcon size={22} />
					</span>
					<div>
						<h3 className={styles.toolName}>
							React <code>@honeyicons/react</code>
						</h3>
						<p>
							Typed components with consistent sizing, strokes, and theme
							support.
						</p>
					</div>
				</div>
				<div className={styles.toolItem}>
					<span className={styles.toolIcon}>
						<FileCode size={22} />
					</span>
					<div>
						<h3 className={styles.toolName}>
							Catalog <code>Search &amp; copy</code>
						</h3>
						<p>
							Find an icon in the catalog and copy its React snippet into your
							project.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

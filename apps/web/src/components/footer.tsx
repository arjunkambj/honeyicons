import {
	Brain,
	File,
	FileCode,
	type HoneyIcon,
	React as ReactIcon,
} from "@honeyicons/react";
import { Link } from "@tanstack/react-router";
import { BrandMark } from "@/components/brand-mark";
import styles from "@/components/marketing.module.css";

type FooterLink =
	| {
			label: string;
			to: "/docs" | "/icons" | "/changelog";
			href?: never;
			icon: HoneyIcon;
	  }
	| { label: string; href: string; to?: never; icon: HoneyIcon };

const footerGroups: {
	title: string;
	links: FooterLink[];
}[] = [
	{
		title: "Documentation",
		links: [
			{ label: "React", to: "/docs", icon: ReactIcon },
			{ label: "Icon catalog", to: "/icons", icon: FileCode },
			{ label: "Changelog", to: "/changelog", icon: File },
			{ label: "AI context", href: "/llms.txt", icon: Brain },
		],
	},
	{
		title: "Resources",
		links: [{ label: "Licenses & credits", href: "/credits.txt", icon: File }],
	},
];

export function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={styles.footerBrand}>
				<Link to="/" className="flex items-center gap-3 font-semibold text-lg">
					<BrandMark className="size-7" />
					honeyicons
				</Link>
				<p>
					© {new Date().getFullYear()} Honeyicons.
					<br />
					Thoughtful icons for things you’re building.
					<br />
					See licenses &amp; credits for icon attribution.
				</p>
			</div>
			{footerGroups.map(({ title, links }) => (
				<nav key={title} aria-label={title}>
					<h2>{title}</h2>
					<ul className={styles.footerLinks}>
						{links.map((link) => {
							const Icon = link.icon;
							if (link.to) {
								return (
									<li key={link.label}>
										<Link to={link.to}>
											<Icon size={18} />
											{link.label}
										</Link>
									</li>
								);
							}
							return (
								<li key={link.label}>
									<a href={link.href}>
										<Icon size={18} />
										{link.label}
									</a>
								</li>
							);
						})}
					</ul>
				</nav>
			))}
		</footer>
	);
}

import { Icon, type IconName, Link as LinkIcon } from "@honeyicons/react";
import { cn } from "@honeyicons/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { DocsPath } from "./docs-nav";

/* The docs' building blocks, modeled on the components a docs platform
gives you: sections with anchors, steps, callouts, link cards, prop fields,
and live previews. */

export function Section({
	id,
	title,
	children,
}: {
	id: string;
	title: string;
	children: ReactNode;
}) {
	return (
		<section
			id={id}
			aria-labelledby={`${id}-title`}
			className="scroll-mt-32 lg:scroll-mt-20"
		>
			<h2
				id={`${id}-title`}
				className="group mb-3 flex items-center gap-2 font-heading font-semibold text-2xl tracking-tight"
			>
				<a href={`#${id}`} className="outline-none">
					{title}
				</a>
				<LinkIcon
					size={16}
					aria-hidden
					className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
				/>
			</h2>
			<div className="flex flex-col gap-3">{children}</div>
		</section>
	);
}

export function Prose({ children }: { children: ReactNode }) {
	return (
		<p className="text-[15px] text-muted-foreground leading-6.5 [&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_code]:text-foreground [&_strong]:font-medium [&_strong]:text-foreground">
			{children}
		</p>
	);
}

export function Steps({ children }: { children: ReactNode }) {
	return <ol className="flex flex-col">{children}</ol>;
}

export function Step({
	number,
	title,
	last = false,
	children,
}: {
	number: number;
	title: string;
	last?: boolean;
	children: ReactNode;
}) {
	return (
		<li className={cn("relative pl-11", !last && "pb-10")}>
			<span className="absolute top-0 left-0 surface flex size-7 items-center justify-center rounded-full font-medium text-sm tabular-nums">
				{number}
			</span>
			{!last && (
				<span
					aria-hidden
					className="absolute top-9 bottom-1 left-3.5 w-px bg-border"
				/>
			)}
			<h3 className="font-medium leading-7">{title}</h3>
			<div className="mt-3 flex flex-col gap-4">{children}</div>
		</li>
	);
}

const calloutTones = {
	note: {
		icon: "info-square",
		className: "[&_svg]:text-sky-600 dark:[&_svg]:text-sky-400",
	},
	tip: {
		icon: "lightbulb",
		className: "[&_svg]:text-emerald-600 dark:[&_svg]:text-emerald-400",
	},
	warning: {
		icon: "alert-triangle",
		className: "[&_svg]:text-amber-600 dark:[&_svg]:text-amber-400",
	},
} as const satisfies Record<string, { icon: IconName; className: string }>;

export function Callout({
	tone = "note",
	children,
}: {
	tone?: keyof typeof calloutTones;
	children: ReactNode;
}) {
	const { icon, className } = calloutTones[tone];
	return (
		<div
			className={cn(
				"surface flex gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm leading-6 [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_code]:font-mono [&_code]:text-[13px]",
				className,
			)}
		>
			<Icon icon={icon} size={18} className="mt-0.5 shrink-0" />
			<div className="text-foreground/85">{children}</div>
		</div>
	);
}

export function CardGroup({ children }: { children: ReactNode }) {
	return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

export function LinkCard({
	to,
	icon,
	title,
	children,
}: {
	to: DocsPath | "/icons";
	icon: IconName;
	title: string;
	children: ReactNode;
}) {
	return (
		<Link
			to={to}
			className="group flex flex-col gap-0.5 surface rounded-2xl px-4 pt-3 pb-2.5 transition-colors hover:bg-card"
		>
			<Icon icon={icon} size={20} className="mb-2.5 text-primary" />
			<span className="font-medium leading-6">{title}</span>
			<span className="text-muted-foreground text-sm leading-6">
				{children}
			</span>
		</Link>
	);
}

export function ParamField({
	name,
	type,
	required = false,
	defaultValue,
	children,
}: {
	name: string;
	type: string;
	required?: boolean;
	defaultValue?: string;
	children: ReactNode;
}) {
	return (
		<div className="border-border border-b py-3 first:pt-0 last:border-b-0">
			<div className="flex flex-wrap items-center gap-2 font-mono text-xs">
				<span className="font-semibold text-primary text-sm">{name}</span>
				<span className="rounded-md bg-muted px-1.5 py-0.5 text-muted-foreground">
					{type}
				</span>
				{required && (
					<span className="rounded-md bg-rose-500/10 px-1.5 py-0.5 text-rose-600 dark:text-rose-400">
						required
					</span>
				)}
				{defaultValue && (
					<span className="rounded-md bg-muted px-1.5 py-0.5 text-muted-foreground">
						default: {defaultValue}
					</span>
				)}
			</div>
			<div className="mt-2 text-muted-foreground text-sm leading-6 [&_code]:font-mono [&_code]:text-[13px] [&_code]:text-foreground">
				{children}
			</div>
		</div>
	);
}

/** A live result, shown above the code that makes it. */
export function Preview({
	className,
	children,
}: {
	className?: string;
	children: ReactNode;
}) {
	return (
		<div
			className={cn(
				"flex min-h-24 flex-wrap items-end justify-center gap-x-10 gap-y-4 surface rounded-2xl px-6 py-3.5",
				className,
			)}
		>
			{children}
		</div>
	);
}

export function Sample({
	label,
	children,
}: {
	label: string;
	children: ReactNode;
}) {
	return (
		<figure className="flex flex-col items-center gap-2.5">
			{children}
			<figcaption className="font-mono text-muted-foreground text-xs">
				{label}
			</figcaption>
		</figure>
	);
}

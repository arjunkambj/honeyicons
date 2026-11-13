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
			className="scroll-mt-32 lg:scroll-mt-24"
		>
			<h2
				id={`${id}-title`}
				className="group mb-4 flex items-center gap-2 font-semibold text-heading"
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
			<div className="flex flex-col gap-4">{children}</div>
		</section>
	);
}

export function Prose({ children }: { children: ReactNode }) {
	return (
		<p className="text-body text-muted-foreground [&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1 [&_code]:font-mono [&_code]:text-caption [&_code]:text-foreground [&_strong]:font-medium [&_strong]:text-foreground">
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
		<li className={cn("relative pl-12", !last && "pb-8")}>
			<span className="absolute top-0 left-0 surface flex size-8 items-center justify-center rounded-full font-medium text-label tabular-nums">
				{number}
			</span>
			{!last && (
				<span
					aria-hidden
					className="absolute top-10 bottom-2 left-4 w-px bg-border"
				/>
			)}
			<h3 className="pt-1 font-medium text-body">{title}</h3>
			<div className="mt-4 flex flex-col gap-4">{children}</div>
		</li>
	);
}

const calloutTones = {
	note: "info-square",
	tip: "lightbulb",
	warning: "alert-triangle",
} as const satisfies Record<string, IconName>;

export function Callout({
	tone = "note",
	children,
}: {
	tone?: keyof typeof calloutTones;
	children: ReactNode;
}) {
	return (
		<div className="surface flex gap-3 rounded-2xl p-4 text-label [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_code]:font-mono [&_code]:text-caption">
			<Icon
				icon={calloutTones[tone]}
				size={20}
				className="shrink-0 text-primary"
			/>
			<div>{children}</div>
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
			className="group flex flex-col gap-1 surface rounded-2xl p-4 transition-colors hover:bg-card"
		>
			<Icon icon={icon} size={20} className="mb-2 text-primary" />
			<span className="font-medium text-body">{title}</span>
			<span className="text-label text-muted-foreground">{children}</span>
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
		<div className="border-border border-b py-4 first:pt-0 last:border-b-0">
			<div className="flex flex-wrap items-center gap-2 font-mono text-caption">
				<span className="font-semibold text-label text-primary">{name}</span>
				<span className="rounded-md bg-muted px-2 text-muted-foreground">
					{type}
				</span>
				{required && (
					<span className="rounded-md bg-primary/10 px-2 text-primary">
						required
					</span>
				)}
				{defaultValue && (
					<span className="rounded-md bg-muted px-2 text-muted-foreground">
						default: {defaultValue}
					</span>
				)}
			</div>
			<div className="mt-2 text-label text-muted-foreground [&_code]:font-mono [&_code]:text-caption [&_code]:text-foreground">
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
				"flex min-h-24 flex-wrap items-end justify-center gap-x-8 gap-y-4 surface rounded-2xl px-6 py-4",
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
		<figure className="flex flex-col items-center gap-2">
			{children}
			<figcaption className="font-mono text-caption text-muted-foreground">
				{label}
			</figcaption>
		</figure>
	);
}

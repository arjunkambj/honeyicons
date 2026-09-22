import { Check, Copy } from "@honeyicons/react";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@honeyicons/ui/components/tabs";
import { cn } from "@honeyicons/ui/lib/utils";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CopyButton } from "@/components/code-block";

const installOptions = [
	{ id: "pnpm", label: "pnpm", command: "pnpm add @honeyicons/react" },
	{ id: "npm", label: "npm", command: "npm i @honeyicons/react" },
	{ id: "yarn", label: "yarn", command: "yarn add @honeyicons/react" },
	{ id: "bun", label: "bun", command: "bun add @honeyicons/react" },
] as const;

type InstallOption = (typeof installOptions)[number];

function copyLabel({ command }: InstallOption) {
	return `Copy install command: ${command}`;
}

function CopyInstallCommand({ option }: { option: InstallOption }) {
	const [copied, setCopied] = useState(false);
	const timeoutRef = useRef(0);
	const CopyIcon = copied ? Check : Copy;
	useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

	async function copy() {
		try {
			await navigator.clipboard.writeText(option.command);
		} catch {
			toast.error(
				"Could not copy. Check your browser’s clipboard permissions.",
			);
			return;
		}
		setCopied(true);
		window.clearTimeout(timeoutRef.current);
		timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
	}

	return (
		<button
			type="button"
			onClick={copy}
			aria-label={copyLabel(option)}
			className="inline-flex min-h-10 max-w-full items-center gap-4 rounded-xl border border-border bg-card px-4 py-1.5 font-mono text-muted-foreground text-sm transition-colors hover:border-foreground/25 hover:text-foreground"
		>
			<span className="truncate">
				<span aria-hidden className="mr-2 text-foreground/40">
					$
				</span>
				{option.command}
			</span>
			<CopyIcon
				size={16}
				className={copied ? "shrink-0 text-foreground" : "shrink-0"}
			/>
		</button>
	);
}

function InstallTabs({ className }: { className?: string }) {
	return (
		<TabsList aria-label="Install method" className={className}>
			{installOptions.map(({ id, label }) => (
				<TabsTrigger key={id} value={id}>
					{label}
				</TabsTrigger>
			))}
		</TabsList>
	);
}

export function InstallCommand({
	className,
	layout = "pill",
}: {
	className?: string;
	layout?: "pill" | "panel";
}) {
	const [selected, setSelected] = useState<InstallOption>(installOptions[0]);

	function onValueChange(value: unknown) {
		const next = installOptions.find((item) => item.id === value);
		if (next) {
			setSelected(next);
		}
	}

	if (layout === "panel") {
		return (
			<Tabs
				value={selected.id}
				onValueChange={onValueChange}
				className={cn("mt-6 w-full gap-0", className)}
			>
				<div className="overflow-hidden rounded-2xl bg-card">
					<div className="flex items-center gap-2 border-b border-border/60 px-3 py-1 sm:gap-3 sm:px-4">
						<InstallTabs className="bg-muted" />
						<CopyButton
							key={selected.id}
							text={selected.command}
							label={copyLabel(selected)}
							className="ml-auto"
						/>
					</div>
					<pre className="overflow-x-auto px-4 py-3 font-mono text-sm leading-7 sm:px-5">
						<code className="whitespace-pre">
							<span aria-hidden className="mr-2 text-foreground/40 select-none">
								$
							</span>
							{selected.command}
							<span
								aria-hidden
								className="ml-1 inline-block h-3.5 w-0.5 translate-y-[2px] bg-foreground motion-safe:animate-caret-blink"
							/>
						</code>
					</pre>
				</div>
			</Tabs>
		);
	}

	return (
		<Tabs
			value={selected.id}
			onValueChange={onValueChange}
			className={cn(
				"mt-6 inline-flex max-w-full items-center gap-2.5",
				className,
			)}
		>
			<InstallTabs />
			{installOptions.map((option) => (
				<TabsContent key={option.id} value={option.id}>
					<CopyInstallCommand option={option} />
				</TabsContent>
			))}
		</Tabs>
	);
}

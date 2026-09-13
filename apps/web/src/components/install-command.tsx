import { Check, Copy, Terminal } from "@honeyicons/react";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@honeyicons/ui/components/tabs";
import { cn } from "@honeyicons/ui/lib/utils";
import { useState } from "react";
import { CopyButton } from "@/components/code-block";

const installCommands = [
	{ id: "pnpm", label: "pnpm", command: "pnpm add @honeyicons/react" },
	{ id: "npm", label: "npm", command: "npm i @honeyicons/react" },
	{ id: "yarn", label: "yarn", command: "yarn add @honeyicons/react" },
	{ id: "bun", label: "bun", command: "bun add @honeyicons/react" },
] as const;

type Manager = (typeof installCommands)[number]["id"];

function CopyInstallCommand({ command }: { command: string }) {
	const [copied, setCopied] = useState(false);
	const CopyIcon = copied ? Check : Copy;

	async function copy() {
		await navigator.clipboard.writeText(command);
		setCopied(true);
		window.setTimeout(() => setCopied(false), 2000);
	}

	return (
		<button
			type="button"
			onClick={copy}
			aria-label={`Copy install command: ${command}`}
			className="inline-flex max-w-full items-center gap-3 rounded-full border border-border bg-muted/50 py-2 pr-4 pl-5 font-mono text-muted-foreground text-sm transition-colors hover:border-foreground/25 hover:text-foreground"
		>
			<span className="truncate">
				<span aria-hidden className="mr-2 text-foreground/40">
					$
				</span>
				{command}
			</span>
			<CopyIcon
				size={16}
				className={copied ? "shrink-0 text-foreground" : "shrink-0"}
			/>
		</button>
	);
}

function PackageManagerTabs({ className }: { className?: string }) {
	return (
		<TabsList aria-label="Package manager" className={className}>
			{installCommands.map(({ id, label }) => (
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
	const [manager, setManager] = useState<Manager>("pnpm");
	const command =
		installCommands.find((item) => item.id === manager)?.command ??
		installCommands[0].command;

	function onValueChange(value: unknown) {
		if (
			value === "npm" ||
			value === "pnpm" ||
			value === "yarn" ||
			value === "bun"
		) {
			setManager(value);
		}
	}

	if (layout === "panel") {
		return (
			<Tabs
				value={manager}
				onValueChange={onValueChange}
				className={cn("mt-6 w-full gap-0", className)}
			>
				<div className="overflow-hidden rounded-2xl bg-card">
					<div className="flex items-center gap-2 border-b border-border/60 px-3 py-1 sm:gap-3 sm:px-4">
						<span
							aria-hidden
							className="grid size-5 shrink-0 place-items-center rounded-md bg-foreground text-background"
						>
							<Terminal size={12} />
						</span>
						<PackageManagerTabs className="bg-muted" />
						<CopyButton
							key={command}
							text={command}
							label={`Copy install command: ${command}`}
							className="ml-auto"
						/>
					</div>
					<pre className="overflow-x-auto px-4 py-3 font-mono text-sm leading-7 sm:px-5">
						<code className="whitespace-pre">
							<span aria-hidden className="mr-2 text-foreground/40 select-none">
								$
							</span>
							{command}
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
			value={manager}
			onValueChange={onValueChange}
			className={cn("mt-6 inline-flex items-center gap-3", className)}
		>
			<PackageManagerTabs />
			{installCommands.map(({ id, command: itemCommand }) => (
				<TabsContent key={id} value={id}>
					<CopyInstallCommand command={itemCommand} />
				</TabsContent>
			))}
		</Tabs>
	);
}

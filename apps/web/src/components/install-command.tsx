import { Check, Copy } from "@honeyicons/react";
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
	{ id: "npm", label: "npm", command: "npm i @honeyicons/react" },
	{ id: "pnpm", label: "pnpm", command: "pnpm add @honeyicons/react" },
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
	const [manager, setManager] = useState<Manager>("npm");
	const command =
		installCommands.find((item) => item.id === manager)?.command ??
		installCommands[0].command;

	function onValueChange(value: unknown) {
		if (value === "npm" || value === "pnpm" || value === "bun") {
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
				<div className="overflow-hidden rounded-2xl bg-muted">
					<div className="flex items-center justify-between gap-3 px-2 py-1.5">
						<PackageManagerTabs className="bg-background" />
						<CopyButton
							key={command}
							text={command}
							label={`Copy install command: ${command}`}
						/>
					</div>
					<pre className="overflow-x-auto px-5 py-4 font-mono text-sm leading-7">
						<code>
							<span aria-hidden className="mr-2 text-foreground/40">
								$
							</span>
							{command}
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

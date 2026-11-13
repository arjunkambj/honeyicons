import { Sparkles } from "@honeyicons/react";
import { Tabs, TabsList, TabsTrigger } from "@honeyicons/ui/components/tabs";
import { cn } from "@honeyicons/ui/lib/utils";
import { useState } from "react";
import { CopyButton } from "@/components/code-block";
import { setupPrompt } from "@/lib/setup-prompt";

const installOptions = [
	{ id: "pnpm", command: "pnpm add @honeyicons/react" },
	{ id: "npm", command: "npm i @honeyicons/react" },
	{ id: "yarn", command: "yarn add @honeyicons/react" },
	{ id: "bun", command: "bun add @honeyicons/react" },
] as const;

const quickInstallCommand = "npm i @honeyicons/react";

/** One card with the install command for each package manager. */
export function InstallCommand({ className }: { className?: string }) {
	const [selectedId, setSelectedId] = useState<string>(installOptions[0].id);
	const selected =
		installOptions.find((option) => option.id === selectedId) ??
		installOptions[0];

	return (
		<Tabs
			value={selected.id}
			onValueChange={(value) => setSelectedId(String(value))}
			className={cn("surface w-full gap-0 rounded-2xl px-1 py-1", className)}
		>
			<div className="flex items-center gap-2">
				<TabsList aria-label="Package manager">
					{installOptions.map(({ id }) => (
						<TabsTrigger key={id} value={id} className="px-2 text-caption">
							{id}
						</TabsTrigger>
					))}
				</TabsList>
				<CopyButton
					key={selected.id}
					text={selected.command}
					label={`Copy ${selected.command}`}
					className="ml-auto"
				/>
			</div>
			<pre className="overflow-x-auto px-3 py-2 font-mono text-caption">
				<code>
					<span aria-hidden className="mr-2 text-muted-foreground select-none">
						$
					</span>
					{selected.command}
				</code>
			</pre>
		</Tabs>
	);
}

/** The home page's install command: one line with a copy button. */
export function QuickInstall() {
	return (
		<div className="flex h-10 min-w-0 items-center gap-2 rounded-full bg-card pr-2 pl-4 shadow-xxs">
			<pre className="min-w-0 overflow-x-auto font-mono text-caption">
				<code>
					<span aria-hidden className="mr-2 text-muted-foreground select-none">
						$
					</span>
					{quickInstallCommand}
				</code>
			</pre>
			<CopyButton
				text={quickInstallCommand}
				label={`Copy ${quickInstallCommand}`}
			/>
		</div>
	);
}

/** The home page's other way in: a setup prompt to paste into a coding agent. */
export function AgentSetup() {
	return (
		<div className="flex flex-wrap items-center gap-2 text-caption text-muted-foreground">
			<Sparkles size={14} className="shrink-0" />
			Using a coding agent?
			<CopyButton
				text={setupPrompt}
				label="Copy the setup prompt for coding agents"
				className="bg-card shadow-xxs hover:bg-card/70"
			>
				Copy setup prompt
			</CopyButton>
		</div>
	);
}

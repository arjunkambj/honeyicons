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

/**
 * One card with the install command for each package manager and, when
 * `agentPrompt` is set, a last row that copies the setup prompt for coding agents.
 */
export function InstallCommand({
	agentPrompt = false,
	className,
}: {
	agentPrompt?: boolean;
	className?: string;
}) {
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
				<TabsList aria-label="Package manager" className="h-7 p-0.5">
					{installOptions.map(({ id }) => (
						<TabsTrigger key={id} value={id} className="px-2.5 text-[13px]">
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
			<pre className="overflow-x-auto px-3 pt-2 pb-1.5 font-mono text-[13px] leading-6">
				<code>
					<span aria-hidden className="mr-2 text-muted-foreground select-none">
						$
					</span>
					{selected.command}
				</code>
			</pre>
			{agentPrompt && (
				<div className="flex items-center gap-2 rounded-xl bg-muted py-1 pr-1 pl-3 text-[13px]">
					<Sparkles size={14} className="shrink-0 text-primary" />
					<span className="min-w-0 flex-1 truncate text-muted-foreground">
						Or let your coding agent set it up
					</span>
					<CopyButton
						text={setupPrompt}
						label="Copy the setup prompt for coding agents"
						className="bg-card hover:bg-card/70"
					>
						Copy prompt
					</CopyButton>
				</div>
			)}
		</Tabs>
	);
}

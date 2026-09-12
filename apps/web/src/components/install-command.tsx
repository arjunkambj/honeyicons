import { Check, Copy } from "@honeyicons/react";
import { cn } from "@honeyicons/ui/lib/utils";
import { useState } from "react";

const command = "npm i @honeyicons/react";

export function InstallCommand({ className }: { className?: string }) {
	const [copied, setCopied] = useState(false);
	const CopyIcon = copied ? Check : Copy;

	async function copy() {
		await navigator.clipboard.writeText(command);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<button
			type="button"
			onClick={copy}
			aria-label={`Copy install command: ${command}`}
			className={cn(
				"mt-6 inline-flex max-w-full items-center gap-3 rounded-full border border-border bg-muted/50 py-2 pr-4 pl-5 font-mono text-muted-foreground text-sm transition-colors hover:border-foreground/25 hover:text-foreground",
				className,
			)}
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

"use client";

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

const command = "npm i @honeyicons/react";

export function InstallCommand() {
	const [copied, setCopied] = useState(false);

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
			className="mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-muted/50 py-2 pr-4 pl-5 font-mono text-muted-foreground text-sm transition-colors hover:border-foreground/25 hover:text-foreground"
		>
			<span>
				<span aria-hidden className="mr-2 text-foreground/40">
					$
				</span>
				{command}
			</span>
			<HugeiconsIcon
				icon={copied ? Tick02Icon : Copy01Icon}
				size={16}
				strokeWidth={2}
				className={copied ? "text-foreground" : undefined}
			/>
		</button>
	);
}

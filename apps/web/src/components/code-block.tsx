import { Check, Copy } from "@honeyicons/react";
import { Button } from "@honeyicons/ui/components/button";
import { cn } from "@honeyicons/ui/lib/utils";
import { useEffect, useRef, useState } from "react";

export function CopyButton({
	text,
	label = "Copy",
	className,
}: {
	text: string;
	label?: string;
	className?: string;
}) {
	const [copied, setCopied] = useState(false);
	const timeoutRef = useRef(0);

	useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

	async function copy() {
		await navigator.clipboard.writeText(text);
		setCopied(true);
		window.clearTimeout(timeoutRef.current);
		timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
	}

	return (
		<Button
			type="button"
			variant="ghost"
			size="icon-xs"
			onClick={copy}
			aria-label={copied ? "Copied" : label}
			className={cn("text-muted-foreground hover:text-foreground", className)}
		>
			{copied ? <Check /> : <Copy />}
		</Button>
	);
}

export function CodeBlock({
	code,
	label = "tsx",
	className,
}: {
	code: string;
	label?: string;
	className?: string;
}) {
	return (
		<div className={cn("overflow-hidden rounded-2xl bg-muted", className)}>
			<div className="flex items-center justify-between gap-3 px-3 py-1.5 pl-5">
				<span className="text-muted-foreground text-xs">{label}</span>
				<CopyButton text={code} label={`Copy ${label} snippet`} />
			</div>
			<pre className="overflow-x-auto px-5 pb-5 font-mono text-sm leading-7">
				<code>{code}</code>
			</pre>
		</div>
	);
}

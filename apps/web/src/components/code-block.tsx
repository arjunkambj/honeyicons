import { Check, Copy } from "@honeyicons/react";
import { Button } from "@honeyicons/ui/components/button";
import { cn } from "@honeyicons/ui/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type TokenTone =
	| "tag"
	| "attr"
	| "eq"
	| "string"
	| "keyword"
	| "number"
	| "comment"
	| "plain";

type Token = { text: string; tone: TokenTone };

const tokenPattern =
	/(\/\/.*$)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(import|from|export|const|return|function|type)\b|(<\/?)([A-Za-z][\w.]*)|([A-Za-z][\w.-]*)(=)|(\b\d+(?:\.\d+)?\b)/g;

function tokenizeLine(line: string): Token[] {
	const tokens: Token[] = [];
	let lastIndex = 0;
	tokenPattern.lastIndex = 0;
	for (const match of line.matchAll(tokenPattern)) {
		const { index } = match;
		if (index > lastIndex) {
			tokens.push({ text: line.slice(lastIndex, index), tone: "plain" });
		}
		const [
			full,
			comment,
			string,
			keyword,
			tagOpen,
			tagName,
			attrName,
			eq,
			number,
		] = match;
		if (comment) {
			tokens.push({ text: full, tone: "comment" });
		} else if (string) {
			tokens.push({ text: full, tone: "string" });
		} else if (keyword) {
			tokens.push({ text: full, tone: "keyword" });
		} else if (tagOpen) {
			tokens.push({ text: tagOpen, tone: "plain" });
			tokens.push({ text: tagName, tone: "tag" });
		} else if (attrName) {
			tokens.push({ text: attrName, tone: "attr" });
			tokens.push({ text: eq, tone: "eq" });
		} else if (number) {
			tokens.push({ text: full, tone: "number" });
		}
		lastIndex = index + full.length;
	}
	if (lastIndex < line.length) {
		tokens.push({ text: line.slice(lastIndex), tone: "plain" });
	}
	return tokens;
}

const toneClass: Record<TokenTone, string> = {
	tag: "font-medium",
	attr: "text-primary",
	eq: "text-muted-foreground",
	string: "",
	keyword: "text-muted-foreground",
	number: "text-primary",
	comment: "text-muted-foreground italic",
	plain: "",
};

export function CopyButton({
	text,
	label = "Copy",
	children,
	className,
}: {
	text: string;
	label?: string;
	children?: ReactNode;
	className?: string;
}) {
	const [copied, setCopied] = useState(false);
	const timeoutRef = useRef(0);

	useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

	async function copy() {
		try {
			await navigator.clipboard.writeText(text);
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

	const icon = copied ? (
		<Check size={14} className="size-3.5" />
	) : (
		<Copy size={14} className="size-3.5" />
	);

	if (children) {
		return (
			<Button
				type="button"
				variant="secondary"
				size="xs"
				onClick={copy}
				aria-label={copied ? "Copied" : label}
				className={cn("h-6 gap-1 px-2", className)}
			>
				{icon}
				{copied ? "Copied" : children}
			</Button>
		);
	}

	return (
		<Button
			type="button"
			variant="ghost"
			size="icon-xs"
			onClick={copy}
			aria-label={copied ? "Copied" : label}
			className={cn(
				"size-7 text-muted-foreground hover:text-foreground",
				className,
			)}
		>
			{icon}
		</Button>
	);
}

export function CodeBlock({
	code,
	title,
	label = "code",
	className,
}: {
	code: string;
	/** File name or caption shown in the header bar. */
	title?: string;
	label?: string;
	className?: string;
}) {
	const lines = code.split("\n");
	return (
		<div
			className={cn("surface relative overflow-hidden rounded-2xl", className)}
		>
			{title ? (
				<div className="flex h-10 items-center gap-2 pr-2 pl-4">
					<span className="font-mono text-caption text-muted-foreground">
						{title}
					</span>
					<CopyButton text={code} label={`Copy ${title}`} className="ml-auto" />
				</div>
			) : (
				<CopyButton
					text={code}
					label={`Copy ${label}`}
					className="absolute top-2 right-2 z-10 bg-card ring-4 ring-card hover:bg-muted"
				/>
			)}
			<pre
				className={cn(
					"overflow-x-auto pb-4 font-mono text-caption",
					!title && "pt-4",
				)}
			>
				<code className="block min-w-max">
					{lines.map((line, index) => (
						<span key={index} className="flex min-h-5 pr-12 pl-4">
							<span
								aria-hidden
								className="hidden w-8 shrink-0 pr-4 text-right text-muted-foreground/50 select-none sm:block"
							>
								{index + 1}
							</span>
							<span className="whitespace-pre">
								{tokenizeLine(line).map((token, tokenIndex) => (
									<span key={tokenIndex} className={toneClass[token.tone]}>
										{token.text}
									</span>
								))}
							</span>
						</span>
					))}
				</code>
			</pre>
		</div>
	);
}

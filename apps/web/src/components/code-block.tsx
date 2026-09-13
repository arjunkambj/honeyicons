import { Check, Copy } from "@honeyicons/react";
import { Button } from "@honeyicons/ui/components/button";
import { cn } from "@honeyicons/ui/lib/utils";
import { useEffect, useRef, useState } from "react";

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
		const index = match.index ?? 0;
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
	tag: "text-[#116329] dark:text-[#7ee787]",
	attr: "text-[#0550ae] dark:text-[#79c0ff]",
	eq: "text-[#cf222e] dark:text-[#ff7b72]",
	string: "text-[#0a3069] dark:text-[#a5d6ff]",
	keyword: "text-[#cf222e] dark:text-[#ff7b72]",
	number: "text-[#0550ae] dark:text-[#79c0ff]",
	comment: "text-muted-foreground italic",
	plain: "",
};

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
			className={cn(
				"size-7 text-muted-foreground hover:text-foreground",
				className,
			)}
		>
			{copied ? (
				<Check size={16} className="size-4" />
			) : (
				<Copy size={16} className="size-4" />
			)}
		</Button>
	);
}

export function CodeBlock({
	code,
	label = "Code snippet",
	className,
}: {
	code: string;
	label?: string;
	className?: string;
}) {
	const lines = code.split("\n");
	return (
		<div
			className={cn("relative overflow-hidden rounded-2xl bg-card", className)}
		>
			<CopyButton
				text={code}
				label={`Copy ${label}`}
				className="absolute top-2.5 right-2.5 z-10 bg-transparent"
			/>
			<pre className="overflow-x-auto py-4 font-mono text-[13px] leading-6">
				<code className="block min-w-max">
					{lines.map((line, index) => (
						<span key={index} className="flex px-4">
							<span
								aria-hidden
								className="w-8 shrink-0 pr-4 text-right text-muted-foreground/50 select-none"
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

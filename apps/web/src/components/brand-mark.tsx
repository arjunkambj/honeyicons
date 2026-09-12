import { cn } from "@honeyicons/ui/lib/utils";

export function BrandMark({ className }: { className?: string }) {
	return (
		<span
			aria-hidden
			className={cn("inline-block size-6 shrink-0 bg-current", className)}
			style={{ mask: "url(/brand/symbol.svg) center / contain no-repeat" }}
		/>
	);
}

export function BrandLogo({ className }: { className?: string }) {
	return (
		<span
			aria-hidden
			className={cn(
				"inline-block h-6 w-[148px] shrink-0 bg-current",
				className,
			)}
			style={{ mask: "url(/brand/logo.svg) center / contain no-repeat" }}
		/>
	);
}

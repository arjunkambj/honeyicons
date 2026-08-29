import { cn } from "@honeyicons/ui/lib/utils";

const OUTER = "M12 2L20.66 7L20.66 17L12 22L3.34 17L3.34 7Z";
const INNER =
	"M12 6.75L16.547 9.375L16.547 14.625L12 17.25L7.453 14.625L7.453 9.375Z";

export function BrandMark({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden
			className={cn("size-6", className)}
		>
			<path
				d={OUTER}
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinejoin="round"
				strokeLinecap="round"
			/>
			<path
				d={INNER}
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinejoin="round"
				strokeLinecap="round"
			/>
		</svg>
	);
}

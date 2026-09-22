import type { IconVariant } from "@honeyicons/react";
import type { CatalogItem } from "@honeyicons/react/catalog";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@honeyicons/ui/components/tooltip";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type IconCardProps = {
	item: CatalogItem;
	variant: IconVariant;
	size: number;
	guides: boolean;
};

type IconBounds = { x: number; y: number; width: number; height: number };

export function IconCard({ item, variant, size, guides }: IconCardProps) {
	const Icon = item.component;
	const iconRef = useRef<SVGSVGElement>(null);
	const [bounds, setBounds] = useState<IconBounds | null>(null);
	const scale = size / 24;

	useEffect(() => {
		const svg = iconRef.current;
		if (!guides || !svg) return;
		// Animated icons can mark a stationary shape for stable guide bounds.
		const measuredShape =
			svg.querySelector<SVGGraphicsElement>("[data-honeyicons-bounds]") ?? svg;
		const { x, y, width, height } = measuredShape.getBBox();
		// Include round strokes when comparing with filled brand outlines.
		const strokeWidth = Number(svg.getAttribute("stroke-width") ?? 0);
		setBounds({
			x: x - strokeWidth / 2,
			y: y - strokeWidth / 2,
			width: width + strokeWidth,
			height: height + strokeWidth,
		});
	}, [guides]);

	async function copy() {
		// Each icon renders its first variant by default, so only other styles need the prop.
		const variantProp =
			variant === item.variants[0] ? "" : ` variant="${variant}"`;
		const snippet = `import { Icon } from "@honeyicons/react";\n\n<Icon icon="${item.name}"${variantProp} />`;
		try {
			await navigator.clipboard.writeText(snippet);
		} catch {
			toast.error(
				"Could not copy. Check your browser’s clipboard permissions.",
			);
			return;
		}
		toast(`Copied ${item.name}`, { duration: 2000 });
	}

	return (
		<Tooltip>
			<TooltipTrigger
				onClick={copy}
				aria-label={item.name}
				className="group flex min-w-0 flex-col items-center justify-center gap-1.5 text-foreground outline-none focus-visible:outline-none"
				style={{ minHeight: size + (guides ? 56 : 24) }}
			>
				<div className="relative flex items-center justify-center rounded-lg p-1.5 transition-colors group-hover:bg-muted group-focus-visible:ring-2 group-focus-visible:ring-ring dark:group-hover:bg-muted/50">
					<div
						className="relative shrink-0"
						style={{ width: size, height: size }}
					>
						{guides && (
							<div
								aria-hidden="true"
								className="pointer-events-none absolute inset-0"
							>
								<span className="absolute inset-0 bg-muted/50 outline outline-border" />
								<span className="absolute inset-y-0 left-1/2 border-border border-l" />
								<span className="absolute inset-x-0 top-1/2 border-border border-t" />
							</div>
						)}
						<Icon
							ref={iconRef}
							variant={variant}
							size={size}
							className="relative block opacity-85 transition-opacity group-hover:opacity-100 dark:opacity-100"
						/>
						{guides && bounds && (
							<span
								aria-hidden="true"
								className="pointer-events-none absolute border border-foreground/50 border-dashed"
								style={{
									left: bounds.x * scale,
									top: bounds.y * scale,
									width: bounds.width * scale,
									height: bounds.height * scale,
								}}
							/>
						)}
					</div>
				</div>
				{guides && (
					<span className="whitespace-nowrap font-mono text-muted-foreground text-xs tabular-nums">
						{bounds
							? `${(bounds.height * scale).toFixed(2)}h × ${(bounds.width * scale).toFixed(2)}w px`
							: "—"}
					</span>
				)}
			</TooltipTrigger>
			<TooltipContent>{item.name}</TooltipContent>
		</Tooltip>
	);
}

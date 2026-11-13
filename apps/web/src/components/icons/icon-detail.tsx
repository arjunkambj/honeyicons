import { Close, Copy, Download, type IconVariant } from "@honeyicons/react";
import type { CatalogItem } from "@honeyicons/react/catalog";
import { Button } from "@honeyicons/ui/components/button";
import { cn } from "@honeyicons/ui/lib/utils";
import { useRef } from "react";
import { toast } from "sonner";
import { CopyButton } from "@/components/code-block";
import { CATEGORY_DETAILS, isColorIcon, VARIANT_META } from "./constants";

function snippetFor(item: CatalogItem, variant: IconVariant) {
	// The first variant is the default, so only other styles need the prop.
	const variantProp =
		variant === item.variants[0] ? "" : ` variant="${variant}"`;
	return `<Icon icon="${item.name}"${variantProp} />`;
}

/** Clean, standalone SVG markup from a rendered icon. */
function svgMarkup(svg: SVGSVGElement, name: string) {
	const clone = svg.cloneNode(true) as SVGSVGElement;
	for (const attribute of ["class", "style", "aria-hidden", "role", "color"]) {
		clone.removeAttribute(attribute);
	}
	// Rendered ids carry a per-instance prefix. Give them stable names.
	let markup = clone.outerHTML;
	Array.from(clone.querySelectorAll("[id]"), (element) => element.id).forEach(
		(id, index) => {
			const stable = `${name}-${index}`;
			markup = markup
				.replaceAll(`id="${id}"`, `id="${stable}"`)
				.replaceAll(`#${id})`, `#${stable})`);
		},
	);
	return markup;
}

async function writeClipboard(text: string, message: string) {
	try {
		await navigator.clipboard.writeText(text);
		toast(message, { duration: 2000 });
	} catch {
		toast.error("Couldn’t copy. Your browser blocked the clipboard.");
	}
}

export function IconDetail({
	item,
	variant,
	onVariantChange,
	onTag,
	onClose,
}: {
	item: CatalogItem;
	variant: IconVariant;
	onVariantChange: (variant: IconVariant) => void;
	onTag: (tag: string) => void;
	/** Leave out where the panel is always open. */
	onClose?: () => void;
}) {
	const Component = item.component;
	const exportRef = useRef<SVGSVGElement>(null);
	const snippet = snippetFor(item, variant);
	const code = `import { Icon } from "@honeyicons/react";\n\n${snippet}`;
	const category = CATEGORY_DETAILS[item.category];
	const CategoryIcon = category.icon;

	function svgText() {
		const svg = exportRef.current;
		if (!svg) throw new Error("The icon preview hasn’t rendered yet");
		return svgMarkup(svg, item.name);
	}

	function download() {
		const url = URL.createObjectURL(
			new Blob([svgText()], { type: "image/svg+xml" }),
		);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${item.name}${variant === "bold" ? "-bold" : ""}.svg`;
		link.click();
		URL.revokeObjectURL(url);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-start gap-3">
				<div className="min-w-0 flex-1">
					<h2 className="truncate font-medium font-mono">{item.name}</h2>
					<p className="mt-1 flex items-center gap-1.5 text-muted-foreground text-xs">
						<CategoryIcon size={14} />
						{category.label}
					</p>
				</div>
				{onClose && (
					<Button
						variant="ghost"
						size="icon-sm"
						aria-label="Close details"
						onClick={onClose}
					>
						<Close />
					</Button>
				)}
			</div>

			<div className="flex gap-4 xl:flex-col">
				<div className="flex size-36 shrink-0 items-center justify-center rounded-2xl bg-background xl:h-40 xl:w-full">
					<div className="relative size-24">
						<svg
							viewBox="0 0 24 24"
							aria-hidden="true"
							className="absolute inset-0 size-full text-border"
							fill="none"
							stroke="currentColor"
							strokeWidth={0.1}
						>
							{Array.from({ length: 25 }, (_, i) => (
								<g key={i}>
									<line x1={i} y1={0} x2={i} y2={24} />
									<line x1={0} y1={i} x2={24} y2={i} />
								</g>
							))}
						</svg>
						<Component variant={variant} size={96} className="relative block" />
					</div>
				</div>
				<div className="flex min-w-0 flex-1 flex-col gap-3">
					{item.variants.length > 1 && !isColorIcon(item) && (
						<div
							className="grid grid-cols-2 gap-0.5 rounded-full bg-muted p-0.5"
							role="radiogroup"
							aria-label="Style"
						>
							{VARIANT_META.filter(({ id }) => item.variants.includes(id)).map(
								({ id, label }) => (
									<button
										key={id}
										type="button"
										role="radio"
										aria-checked={variant === id}
										onClick={() => onVariantChange(id)}
										className={cn(
											"flex h-7 items-center justify-center gap-1.5 rounded-full text-sm transition-colors",
											variant === id
												? "bg-card font-medium shadow-xxs"
												: "text-muted-foreground hover:text-foreground",
										)}
									>
										<Component variant={id} size={16} />
										{label}
									</button>
								),
							)}
						</div>
					)}
					<div className="flex items-end justify-between rounded-2xl bg-background px-5 pt-2 pb-1.5">
						{[16, 20, 24, 32].map((size) => (
							<div key={size} className="flex flex-col items-center gap-1">
								<Component variant={variant} size={size} />
								<span className="font-mono text-[10px] text-muted-foreground">
									{size}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-1.5">
				<div className="overflow-hidden rounded-2xl bg-background">
					<div className="flex items-center gap-2 py-0.5 pr-0.5 pl-3">
						<code className="min-w-0 flex-1 truncate font-mono text-[13px]">
							{snippet}
						</code>
						<CopyButton text={code} label={`Copy code for ${item.name}`} />
					</div>
				</div>
				<div className="grid grid-cols-2 gap-2">
					<Button
						variant="secondary"
						onClick={() =>
							void writeClipboard(svgText(), `Copied ${item.name}.svg`)
						}
					>
						<Copy data-icon="inline-start" />
						Copy SVG
					</Button>
					<Button variant="secondary" onClick={download}>
						<Download data-icon="inline-start" />
						Download
					</Button>
				</div>
			</div>
			<span hidden>
				<Component ref={exportRef} variant={variant} size={24} />
			</span>

			{item.tags.length > 0 && (
				<div className="mt-2">
					<h3 className="mb-1.5 font-medium text-muted-foreground text-xs">
						Search tags
					</h3>
					<div className="flex flex-wrap gap-1.5">
						{item.tags.map((tag) => (
							<button
								key={tag}
								type="button"
								onClick={() => onTag(tag)}
								className="rounded-full bg-muted px-2.5 py-0.5 text-muted-foreground text-xs transition-colors hover:text-foreground"
							>
								{tag}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

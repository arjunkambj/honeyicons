"use client";

import type { IconVariant } from "@honeyicons/react";
import type { CatalogItem } from "@honeyicons/react/catalog";
import { toast } from "sonner";

type IconCardProps = {
	item: CatalogItem;
	variant: IconVariant;
	size: number;
};

export function IconCard({ item, variant, size }: IconCardProps) {
	const Icon = item.component;

	async function copy() {
		const snippet = `import { ${item.pascalName} } from "@honeyicons/react";\n\n<${item.pascalName} variant="${variant}" />`;
		await navigator.clipboard.writeText(snippet);
		toast.success(`Copied ${item.name}`);
	}

	return (
		<button
			type="button"
			onClick={copy}
			className="flex flex-col items-center gap-3 rounded-2xl bg-muted/70 px-3 py-4 text-foreground transition-colors hover:bg-muted"
			style={{ minHeight: size + 56 }}
		>
			<Icon variant={variant} size={size} />
			<span className="max-w-full truncate text-muted-foreground text-xs">
				{item.name}
			</span>
		</button>
	);
}

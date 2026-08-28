import { forwardRef } from "react";

import { Icon, type IconProps } from "./icon";
import type { IconNodeMap } from "./types";

export type HoneyIconProps = Omit<IconProps, "iconNode">;

export function createIcon(name: string, nodes: IconNodeMap) {
	const Component = forwardRef<SVGSVGElement, HoneyIconProps>(
		function HoneyIcon({ variant = "linear", ...props }, ref) {
			const iconNode = nodes[variant] ?? nodes.linear;
			if (!iconNode) {
				throw new Error(`Missing icon data for ${name}`);
			}
			return (
				<Icon ref={ref} iconNode={iconNode} variant={variant} {...props} />
			);
		},
	);
	Component.displayName = name;
	return Component;
}

export type HoneyIcon = ReturnType<typeof createIcon>;

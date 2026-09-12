import {
	type ForwardRefExoticComponent,
	forwardRef,
	type RefAttributes,
} from "react";

import { Icon, type IconProps } from "./icon.js";
import { ICON_VARIANTS, type IconNodeMap, type IconVariant } from "./types.js";

export type HoneyIconProps = Omit<IconProps, "iconNode">;

export type HoneyIcon = ForwardRefExoticComponent<
	HoneyIconProps & RefAttributes<SVGSVGElement>
> & {
	variants: readonly IconVariant[];
};

export function createIcon(name: string, nodes: IconNodeMap): HoneyIcon {
	const variants = ICON_VARIANTS.filter((variant) => nodes[variant]);
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
	) as HoneyIcon;
	Component.displayName = name;
	Component.variants = variants;
	return Component;
}

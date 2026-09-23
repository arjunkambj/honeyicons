import {
	type ForwardRefExoticComponent,
	forwardRef,
	type RefAttributes,
} from "react";

import { IconBase, type IconBaseProps } from "./icon-base.js";
import { ICON_VARIANTS, type IconNodeMap, type IconVariant } from "./types.js";

export type HoneyIconProps = Omit<IconBaseProps, "iconNode"> & {
	variant?: IconVariant;
};

export type HoneyIcon = ForwardRefExoticComponent<
	HoneyIconProps & RefAttributes<SVGSVGElement>
> & {
	variants: readonly IconVariant[];
};

export function createIcon(name: string, nodes: IconNodeMap): HoneyIcon {
	const variants = ICON_VARIANTS.filter((variant) => nodes[variant]);
	// Icons drawn only in bold default to bold.
	const [defaultVariant] = variants;
	if (!defaultVariant) {
		throw new Error(`${name} has no icon data`);
	}
	const Component = forwardRef<SVGSVGElement, HoneyIconProps>(
		function HoneyIcon({ variant = defaultVariant, ...props }, ref) {
			if (!Object.hasOwn(nodes, variant)) {
				throw new Error(`${name} has no ${variant} variant`);
			}
			const iconNode = nodes[variant];
			if (!iconNode) {
				throw new Error(`${name} has no ${variant} variant`);
			}
			return <IconBase ref={ref} iconNode={iconNode} {...props} />;
		},
	) as HoneyIcon;
	Component.displayName = name;
	Component.variants = variants;
	return Component;
}

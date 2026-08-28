import { createElement, forwardRef, type SVGProps } from "react";

import type { IconNode, IconVariant } from "./types";

export type IconProps = Omit<
	SVGProps<SVGSVGElement>,
	"ref" | "strokeWidth" | "width" | "height"
> & {
	iconNode: IconNode;
	variant?: IconVariant;
	size?: number | string;
	strokeWidth?: number;
	secondaryColor?: string;
	secondaryOpacity?: number;
	title?: string;
};

export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
	{
		iconNode,
		variant = "linear",
		size = 24,
		color = "currentColor",
		strokeWidth = 1.5,
		secondaryColor,
		secondaryOpacity = 0.2,
		title,
		className,
		style,
		...props
	},
	ref,
) {
	const isLinear = variant === "linear";

	return (
		<svg
			ref={ref}
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill={isLinear ? "none" : "currentColor"}
			stroke="currentColor"
			strokeWidth={isLinear || variant === "duotone" ? strokeWidth : undefined}
			strokeLinecap="round"
			strokeLinejoin="round"
			color={color}
			className={className}
			style={style}
			role={title ? "img" : "presentation"}
			aria-hidden={title ? undefined : true}
			aria-label={title}
			{...props}
		>
			<title>{title ?? ""}</title>
			{iconNode.map(([tag, attrs], index) => {
				const isSecondary = attrs["data-slot"] === "secondary";
				const mapped = isSecondary
					? {
							...attrs,
							stroke: "none",
							fill: secondaryColor ?? attrs.fill ?? "currentColor",
							opacity: secondaryColor ? "1" : String(secondaryOpacity),
						}
					: attrs;
				return createElement(tag, { ...mapped, key: index });
			})}
		</svg>
	);
});

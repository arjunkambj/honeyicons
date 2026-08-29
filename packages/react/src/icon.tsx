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

function paintsStroke(attrs: Record<string, string>) {
	const stroke = attrs.stroke;
	return Boolean(stroke && stroke !== "none");
}

function paintsFill(attrs: Record<string, string>) {
	const fill = attrs.fill;
	return Boolean(fill && fill !== "none");
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
	{
		iconNode,
		variant: _variant = "linear",
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
	// Solar linear icons are filled outlines. A root stroke would draw a
	// second outline on top of the already-baked weight.
	const hasStroke = iconNode.some(([, attrs]) => paintsStroke(attrs));

	return (
		<svg
			ref={ref}
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={hasStroke ? "currentColor" : undefined}
			strokeWidth={hasStroke ? strokeWidth : undefined}
			strokeLinecap={hasStroke ? "round" : undefined}
			strokeLinejoin={hasStroke ? "round" : undefined}
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
				if (isSecondary) {
					return createElement(tag, {
						...attrs,
						stroke: "none",
						fill: secondaryColor ?? attrs.fill ?? "currentColor",
						opacity: secondaryColor ? "1" : String(secondaryOpacity),
						key: index,
					});
				}

				const mapped =
					hasStroke && paintsFill(attrs) && !paintsStroke(attrs)
						? { ...attrs, stroke: "none" }
						: attrs;
				return createElement(tag, { ...mapped, key: index });
			})}
		</svg>
	);
});

import {
	createElement,
	forwardRef,
	type ReactElement,
	type SVGProps,
	useId,
} from "react";

import type { IconNode } from "./types.js";

export type IconBaseProps = Omit<
	SVGProps<SVGSVGElement>,
	"ref" | "strokeWidth" | "width" | "height"
> & {
	iconNode: IconNode;
	size?: number | string;
	strokeWidth?: number;
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

function someNode(
	nodes: IconNode,
	test: (attrs: Record<string, string>) => boolean,
): boolean {
	return nodes.some(
		([, attrs, children]) =>
			test(attrs) || (children !== undefined && someNode(children, test)),
	);
}

function hasId(attrs: Record<string, string>) {
	return attrs.id !== undefined;
}

// Prefix ids and their url(#id) references with a per-instance scope.
function scopeIds(attrs: Record<string, string>, scope: string) {
	const scoped: Record<string, string> = {};
	for (const [key, value] of Object.entries(attrs)) {
		scoped[key] =
			key === "id"
				? `${scope}${value}`
				: value.replace(/url\(#/g, `url(#${scope}`);
	}
	return scoped;
}

function renderNodes(
	nodes: IconNode,
	hasStroke: boolean,
	scope?: string,
	stroked = false,
): ReactElement[] {
	return nodes.map(([tag, attrs, children], key) => {
		// Filled shapes skip the root stroke unless they or their group stroke.
		const painted =
			hasStroke && !stroked && paintsFill(attrs) && !paintsStroke(attrs)
				? { ...attrs, stroke: "none" }
				: attrs;
		const props = { ...(scope ? scopeIds(painted, scope) : painted), key };
		// Passing children positionally would replace a text `children` attribute.
		if (!children) return createElement(tag, props);
		return createElement(
			tag,
			props,
			renderNodes(children, hasStroke, scope, stroked || paintsStroke(attrs)),
		);
	});
}

// Gradients and masks are found by id. Repeated icons need their own ids, or a
// copy inside a hidden subtree can blank out the visible ones. Only icons with
// ids render this, so the rest stay hook-free for renderers such as Satori.
function ScopedNodes({
	iconNode,
	hasStroke,
}: {
	iconNode: IconNode;
	hasStroke: boolean;
}) {
	const scope = `${useId().replace(/[^\w-]/g, "")}-`;
	return <>{renderNodes(iconNode, hasStroke, scope)}</>;
}

export const IconBase = forwardRef<SVGSVGElement, IconBaseProps>(
	function IconBase(
		{
			iconNode,
			size = 24,
			color = "currentColor",
			strokeWidth = 1.8,
			title,
			className,
			style,
			children,
			...props
		},
		ref,
	) {
		// Solar linear icons are filled outlines. A root stroke would draw a
		// second outline on top of the already-baked weight.
		const hasStroke = someNode(iconNode, paintsStroke);
		const hasAccessibleName = Boolean(
			title || props["aria-label"] || props["aria-labelledby"],
		);

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
				role={hasAccessibleName ? "img" : "presentation"}
				aria-hidden={hasAccessibleName ? undefined : true}
				aria-label={title}
				{...props}
			>
				{title ? <title>{title}</title> : null}
				{someNode(iconNode, hasId) ? (
					<ScopedNodes iconNode={iconNode} hasStroke={hasStroke} />
				) : (
					renderNodes(iconNode, hasStroke)
				)}
				{children}
			</svg>
		);
	},
);

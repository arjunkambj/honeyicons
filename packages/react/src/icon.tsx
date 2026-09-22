import {
	type ForwardedRef,
	forwardRef,
	type ReactElement,
	type RefAttributes,
} from "react";

import type { HoneyIconProps } from "./create-icon.js";
import { type IconName, type IconVariantMap, icons } from "./registry.js";

export type IconProps<Name extends IconName = IconName> = Omit<
	HoneyIconProps,
	"variant"
> &
	{
		[Key in Name]: { icon: Key; variant?: IconVariantMap[Key] };
	}[Name];

type IconComponent = (<Name extends IconName>(
	props: IconProps<Name> & RefAttributes<SVGSVGElement>,
) => ReactElement) & { displayName?: string };

export const Icon = forwardRef(function Icon(
	{ icon, ...props }: IconProps,
	ref: ForwardedRef<SVGSVGElement>,
) {
	// Names can come from runtime data, so reject anything outside the registry.
	if (!Object.hasOwn(icons, icon)) {
		throw new Error(`Unknown icon "${icon}"`);
	}
	const Component = icons[icon];
	return <Component ref={ref} {...props} />;
}) as IconComponent;

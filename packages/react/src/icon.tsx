import {
	type ForwardedRef,
	forwardRef,
	type ReactElement,
	type RefAttributes,
} from "react";

import type { HoneyIconProps } from "./create-icon.js";
import { type IconName, type IconVariantMap, icons } from "./registry.js";

// One shape for every name. A union of 490 per-icon shapes made TypeScript
// reject `icon={name}` whenever `name` was typed as IconName.
export type IconProps<Name extends IconName = IconName> = Omit<
	HoneyIconProps,
	"variant"
> & { icon: Name; variant?: IconVariantMap[Name] };

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

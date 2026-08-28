import { Slider as SliderPrimitive } from "@base-ui/react/slider";

import { cn } from "@honeyicons/ui/lib/utils";

function Slider({
	className,
	defaultValue,
	value,
	min = 0,
	max = 100,
	...props
}: SliderPrimitive.Root.Props) {
	const _values = Array.isArray(value)
		? value
		: typeof value === "number"
			? [value]
			: Array.isArray(defaultValue)
				? defaultValue
				: typeof defaultValue === "number"
					? [defaultValue]
					: [min, max];

	return (
		<SliderPrimitive.Root
			className={cn("data-vertical:h-full data-horizontal:w-full", className)}
			data-slot="slider"
			defaultValue={defaultValue}
			value={value}
			min={min}
			max={max}
			thumbAlignment="center"
			{...props}
		>
			<SliderPrimitive.Control className="relative flex w-full touch-none select-none items-center py-1 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col data-disabled:opacity-50">
				<SliderPrimitive.Track
					data-slot="slider-track"
					className="relative flex grow select-none data-horizontal:h-5 data-horizontal:w-full data-vertical:h-full data-vertical:w-5 data-vertical:flex-col"
				>
					<div
						aria-hidden
						className="pointer-events-none absolute bg-[repeating-linear-gradient(90deg,color-mix(in_oklab,var(--color-foreground)_18%,transparent)_0_2px,transparent_2px_9px)] data-horizontal:inset-x-0 data-horizontal:inset-y-1 data-vertical:inset-x-1 data-vertical:inset-y-0 data-vertical:bg-[repeating-linear-gradient(180deg,color-mix(in_oklab,var(--color-foreground)_18%,transparent)_0_2px,transparent_2px_9px)]"
					/>
					<SliderPrimitive.Indicator
						data-slot="slider-range"
						className="rounded-[1px] bg-[repeating-linear-gradient(90deg,var(--color-foreground)_0_3px,transparent_3px_9px)] data-vertical:bg-[repeating-linear-gradient(180deg,var(--color-foreground)_0_3px,transparent_3px_9px)]"
					/>
				</SliderPrimitive.Track>
				{Array.from({ length: _values.length }, (_, index) => (
					<SliderPrimitive.Thumb
						data-slot="slider-thumb"
						key={index}
						index={index}
						className="block h-5 w-7 shrink-0 select-none rounded-full bg-background shadow-[0_1px_3px_rgb(0_0_0/0.15),0_0_0_1px_rgb(0_0_0/0.04)] outline-none transition-transform active:scale-95 disabled:pointer-events-none disabled:opacity-50"
					/>
				))}
			</SliderPrimitive.Control>
		</SliderPrimitive.Root>
	);
}

export { Slider };

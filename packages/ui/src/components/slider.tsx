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
			<SliderPrimitive.Control className="relative flex w-full touch-none select-none items-center py-2 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col data-disabled:opacity-50">
				<SliderPrimitive.Track
					data-slot="slider-track"
					className="relative grow select-none rounded-full bg-input data-horizontal:h-1.5 data-vertical:h-full data-horizontal:w-full data-vertical:w-1.5"
				>
					<SliderPrimitive.Indicator
						data-slot="slider-range"
						className="select-none rounded-full bg-foreground data-horizontal:h-full data-vertical:w-full"
					/>
				</SliderPrimitive.Track>
				{Array.from({ length: _values.length }, (_, index) => (
					<SliderPrimitive.Thumb
						data-slot="slider-thumb"
						key={index}
						index={index}
						className="block size-3.5 shrink-0 select-none rounded-full bg-background shadow-sm ring-1 ring-foreground/15 transition-[box-shadow] hover:ring-4 hover:ring-ring/30 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50"
					/>
				))}
			</SliderPrimitive.Control>
		</SliderPrimitive.Root>
	);
}

export { Slider };

import { Slider as SliderPrimitive } from "@base-ui/react/slider";

import { cn } from "@honeyicons/ui/lib/utils";

type SliderProps = SliderPrimitive.Root.Props & {
	majorStep?: number;
	tickStep?: number;
};

function buildTicks(min: number, max: number, tickStep: number) {
	const count = Math.round((max - min) / tickStep);
	const ticks: number[] = [];
	for (let i = 0; i <= count; i += 1) {
		ticks.push(Number((min + i * tickStep).toFixed(10)));
	}
	return ticks;
}

function isMultiple(value: number, step: number) {
	const quotient = value / step;
	return Math.abs(quotient - Math.round(quotient)) < 1e-6;
}

function Slider({
	className,
	defaultValue,
	value,
	min = 0,
	max = 100,
	step = 1,
	majorStep,
	tickStep,
	...props
}: SliderProps) {
	const _values = Array.isArray(value)
		? value
		: typeof value === "number"
			? [value]
			: Array.isArray(defaultValue)
				? defaultValue
				: typeof defaultValue === "number"
					? [defaultValue]
					: [min, max];
	const current = _values[0] ?? min;
	const marks = buildTicks(
		min,
		max,
		tickStep ?? (typeof step === "number" ? step : 1),
	);

	return (
		<SliderPrimitive.Root
			className={cn(
				"flex w-full touch-none items-center data-vertical:h-full data-vertical:w-auto",
				className,
			)}
			data-slot="slider"
			defaultValue={defaultValue}
			value={value}
			min={min}
			max={max}
			step={step}
			thumbAlignment="edge"
			{...props}
		>
			<SliderPrimitive.Control className="relative flex h-full w-full cursor-ew-resize touch-none select-none items-center data-vertical:min-h-40 data-vertical:w-auto data-disabled:cursor-not-allowed data-vertical:cursor-ns-resize data-vertical:flex-col data-disabled:opacity-50">
				<SliderPrimitive.Track
					data-slot="slider-track"
					className="relative flex h-5 w-full grow select-none data-vertical:h-full data-vertical:w-5 data-vertical:flex-col"
				>
					<div
						aria-hidden
						className="pointer-events-none absolute inset-x-0 inset-y-0 flex items-center justify-between"
					>
						{marks.map((tick) => {
							const major = majorStep ? isMultiple(tick, majorStep) : false;
							const filled = tick <= current + 1e-9;
							return (
								<span
									key={tick}
									className={cn(
										"shrink-0 rounded-full",
										major ? "h-3.5 w-px" : "h-1.5 w-px",
										filled ? "bg-foreground" : "bg-foreground/25",
									)}
								/>
							);
						})}
					</div>
				</SliderPrimitive.Track>
				{Array.from({ length: _values.length }, (_, index) => (
					<SliderPrimitive.Thumb
						data-slot="slider-thumb"
						key={index}
						index={index}
						className="relative z-10 block h-5 w-7 shrink-0 select-none rounded-full bg-background shadow-[0_1px_3px_rgb(0_0_0/0.15),0_0_0_1px_rgb(0_0_0/0.04)] outline-none transition-transform active:scale-95 disabled:pointer-events-none disabled:opacity-50"
					/>
				))}
			</SliderPrimitive.Control>
		</SliderPrimitive.Root>
	);
}

export { Slider };

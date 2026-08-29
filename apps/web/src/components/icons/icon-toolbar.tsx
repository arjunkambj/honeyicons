"use client";

import type { IconVariant } from "@honeyicons/react";
import { Slider } from "@honeyicons/ui/components/slider";
import { TabsList, TabsTrigger } from "@honeyicons/ui/components/tabs";
import { cn } from "@honeyicons/ui/lib/utils";
import type { ComponentProps } from "react";
import {
	SIZE_MAJOR_STEP,
	SIZE_MAX,
	SIZE_MIN,
	STROKE_MAJOR_STEP,
	STROKE_MAX,
	STROKE_MIN,
	STROKE_STEP,
	sliderNumber,
	VARIANT_META,
} from "./constants";

type IconToolbarProps = {
	variant: IconVariant;
	size: number;
	onSizeChange: (size: number) => void;
	strokeWidth: number;
	onStrokeWidthChange: (strokeWidth: number) => void;
	shown: number;
};

function ToolbarSlider({
	label,
	valueText,
	sliderClassName,
	...props
}: {
	label: string;
	valueText: string;
	sliderClassName: string;
} & Omit<ComponentProps<typeof Slider>, "className">) {
	return (
		<div className="flex h-8 items-center overflow-hidden rounded-full bg-muted pr-2.5 pl-3">
			<span className="mr-2 shrink-0 text-muted-foreground text-xs">
				{label}
			</span>
			<Slider
				aria-label={label}
				className={cn("h-8 min-w-0", sliderClassName)}
				{...props}
			/>
			<span className="ml-2 w-12 shrink-0 text-right text-muted-foreground text-xs tabular-nums">
				{valueText}
			</span>
		</div>
	);
}

export function IconToolbar({
	variant,
	size,
	onSizeChange,
	strokeWidth,
	onStrokeWidthChange,
	shown,
}: IconToolbarProps) {
	const strokeDisabled = variant === "bold";

	return (
		<div className="flex flex-wrap items-center gap-3">
			<TabsList>
				{VARIANT_META.map((item) => (
					<TabsTrigger key={item.id} value={item.id}>
						{item.label}
					</TabsTrigger>
				))}
			</TabsList>

			<ToolbarSlider
				label="Size"
				valueText={`${size} px`}
				sliderClassName="w-56"
				min={SIZE_MIN}
				max={SIZE_MAX}
				step={1}
				majorStep={SIZE_MAJOR_STEP}
				value={size}
				onValueChange={(value) => onSizeChange(sliderNumber(value))}
			/>

			<ToolbarSlider
				label="Thickness"
				valueText={`${strokeWidth.toFixed(2).replace(/\.?0+$/, "")} px`}
				sliderClassName="w-32"
				min={STROKE_MIN}
				max={STROKE_MAX}
				step={STROKE_STEP}
				majorStep={STROKE_MAJOR_STEP}
				value={strokeWidth}
				disabled={strokeDisabled}
				onValueChange={(value) => onStrokeWidthChange(sliderNumber(value))}
			/>

			<p className="ml-auto text-muted-foreground text-sm">{shown} shown</p>
		</div>
	);
}

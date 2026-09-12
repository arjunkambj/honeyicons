"use client";

import { Slider } from "@honeyicons/ui/components/slider";
import { TabsList, TabsTrigger } from "@honeyicons/ui/components/tabs";
import { cn } from "@honeyicons/ui/lib/utils";
import type { ComponentProps } from "react";
import {
	SIZE_MAJOR_STEP,
	SIZE_MAX,
	SIZE_MIN,
	sliderNumber,
	VARIANT_META,
} from "./constants";

type IconToolbarProps = {
	size: number;
	onSizeChange: (size: number) => void;
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

export function IconToolbar({ size, onSizeChange, shown }: IconToolbarProps) {
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
				tickStep={SIZE_MAX > 96 ? 8 : 1}
				majorStep={SIZE_MAX > 96 ? 32 : SIZE_MAJOR_STEP}
				value={size}
				onValueChange={(value) => onSizeChange(sliderNumber(value))}
			/>

			<p className="ml-auto text-muted-foreground text-sm">{shown} shown</p>
		</div>
	);
}

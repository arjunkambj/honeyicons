"use client";

import type { IconVariant } from "@honeyicons/react";
import { Slider } from "@honeyicons/ui/components/slider";
import { TabsList, TabsTrigger } from "@honeyicons/ui/components/tabs";
import {
	SIZE_MAX,
	SIZE_MIN,
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

			<div className="flex items-center gap-3 rounded-full bg-muted px-3 py-1.5">
				<span className="shrink-0 text-muted-foreground text-xs">Size</span>
				<Slider
					className="w-32"
					min={SIZE_MIN}
					max={SIZE_MAX}
					step={1}
					value={size}
					aria-label="Icon size"
					onValueChange={(value) => onSizeChange(sliderNumber(value))}
				/>
				<span className="w-9 shrink-0 text-right text-muted-foreground text-xs tabular-nums">
					{size}px
				</span>
			</div>

			<div className="flex items-center gap-3 rounded-full bg-muted px-3 py-1.5">
				<span className="shrink-0 text-muted-foreground text-xs">Stroke</span>
				<Slider
					className="w-28"
					min={STROKE_MIN}
					max={STROKE_MAX}
					step={STROKE_STEP}
					value={strokeWidth}
					disabled={strokeDisabled}
					aria-label="Stroke thickness"
					onValueChange={(value) => onStrokeWidthChange(sliderNumber(value))}
				/>
				<span className="w-10 shrink-0 text-right text-muted-foreground text-xs tabular-nums">
					{strokeWidth.toFixed(2).replace(/\.?0+$/, "")}px
				</span>
			</div>

			<p className="ml-auto text-muted-foreground text-sm">{shown} shown</p>
		</div>
	);
}

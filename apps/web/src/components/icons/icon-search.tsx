"use client";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@honeyicons/ui/components/input-group";
import { Kbd } from "@honeyicons/ui/components/kbd";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { RefObject } from "react";

type IconSearchProps = {
	value: string;
	onChange: (value: string) => void;
	inputRef: RefObject<HTMLInputElement | null>;
};

export function IconSearch({ value, onChange, inputRef }: IconSearchProps) {
	return (
		<InputGroup className="mx-auto h-11 max-w-xl">
			<InputGroupAddon>
				<HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
			</InputGroupAddon>
			<InputGroupInput
				ref={inputRef}
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder="Search icons"
				aria-label="Search icons"
			/>
			<InputGroupAddon align="inline-end">
				<Kbd>⌘K</Kbd>
			</InputGroupAddon>
		</InputGroup>
	);
}

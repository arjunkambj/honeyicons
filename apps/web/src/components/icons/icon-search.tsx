import { Close, Search } from "@honeyicons/react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@honeyicons/ui/components/input-group";
import { Kbd } from "@honeyicons/ui/components/kbd";
import type { RefObject } from "react";

type IconSearchProps = {
	value: string;
	onChange: (value: string) => void;
	inputRef: RefObject<HTMLInputElement | null>;
};

const shortcut = /Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘K" : "Ctrl K";

export function IconSearch({ value, onChange, inputRef }: IconSearchProps) {
	return (
		<InputGroup className="min-w-0 flex-1">
			<InputGroupAddon>
				<Search size={16} />
			</InputGroupAddon>
			<InputGroupInput
				ref={inputRef}
				type="search"
				value={value}
				onChange={(event) => onChange(event.target.value)}
				onKeyDown={(event) => {
					if (event.key !== "Escape") return;
					if (value) {
						event.preventDefault();
						onChange("");
					} else {
						event.currentTarget.blur();
					}
				}}
				placeholder="Search"
				aria-label="Search icons by name or what they show"
				className="[&::-webkit-search-cancel-button]:hidden"
			/>
			<InputGroupAddon align="inline-end">
				{value ? (
					<InputGroupButton
						size="icon-xs"
						aria-label="Clear search"
						onClick={() => {
							onChange("");
							inputRef.current?.focus();
						}}
					>
						<Close size={14} />
					</InputGroupButton>
				) : (
					<Kbd className="hidden sm:inline-flex">{shortcut}</Kbd>
				)}
			</InputGroupAddon>
		</InputGroup>
	);
}

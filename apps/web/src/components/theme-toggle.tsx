import { Computer, Moon, Sun } from "@honeyicons/react";
import {
	ToggleGroup,
	ToggleGroupItem,
} from "@honeyicons/ui/components/toggle-group";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const themeOptions = [
	{ value: "light", label: "Light theme", icon: Sun },
	{ value: "dark", label: "Dark theme", icon: Moon },
	{ value: "system", label: "System theme", icon: Computer },
] as const;

const emptySubscribe = () => () => {};

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const mounted = useSyncExternalStore(
		emptySubscribe,
		() => true,
		() => false,
	);
	const selectedTheme = mounted ? (theme ?? "light") : undefined;
	const selectedIndex = themeOptions.findIndex(
		(option) => option.value === selectedTheme,
	);

	return (
		<ToggleGroup
			variant="segmented"
			size="sm"
			spacing={0.5}
			className="relative isolate p-0.5"
			aria-label="Color theme"
			value={selectedTheme ? [selectedTheme] : []}
			disabled={!mounted}
			onValueChange={(values) => {
				const nextTheme = values[0];
				if (nextTheme) setTheme(nextTheme);
			}}
		>
			<span
				aria-hidden="true"
				className="pointer-events-none absolute top-0.5 left-0.5 -z-1 size-7 rounded-full bg-background transition-transform duration-200 ease-out motion-reduce:transition-none"
				style={{
					transform: `translateX(${Math.max(0, selectedIndex) * 30}px)`,
					opacity: mounted ? 1 : 0,
				}}
			/>
			{themeOptions.map(({ value, label, icon: Icon }) => (
				<ToggleGroupItem
					key={value}
					value={value}
					aria-label={label}
					title={label}
					className="size-7 min-w-7 px-0"
				>
					<Icon variant="bold" />
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
}

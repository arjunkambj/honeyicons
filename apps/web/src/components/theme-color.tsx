import { useTheme } from "next-themes";
import { useEffect } from "react";

// Matches --background in packages/ui/src/styles/globals.css.
const THEME_COLORS = { light: "#fafafa", dark: "#18181b" } as const;

export function ThemeColor() {
	const { resolvedTheme } = useTheme();

	useEffect(() => {
		document
			.querySelector('meta[name="theme-color"]')
			?.setAttribute(
				"content",
				resolvedTheme === "dark" ? THEME_COLORS.dark : THEME_COLORS.light,
			);
	}, [resolvedTheme]);

	return null;
}

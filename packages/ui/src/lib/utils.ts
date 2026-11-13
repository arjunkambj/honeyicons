import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The type scale's names, so a size like text-label isn't mistaken for a color
// and dropped when a text color follows it.
const twMerge = extendTailwindMerge({
	extend: {
		theme: {
			text: ["caption", "label", "body", "lead", "heading", "title", "display"],
		},
	},
});

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

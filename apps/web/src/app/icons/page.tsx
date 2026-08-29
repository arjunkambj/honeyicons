import type { Metadata } from "next";
import { IconBrowser } from "@/components/icons/icon-browser";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
	title: "Icons · honeyicons",
	description: "Browse linear, bold, and duotone icons.",
};

export default function IconsPage() {
	return (
		<>
			<Navbar />
			<main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
				<IconBrowser />
			</main>
		</>
	);
}

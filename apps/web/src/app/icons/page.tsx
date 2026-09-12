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
			<main className="container mx-auto px-7 pt-4 pb-8 sm:px-10 lg:px-12">
				<IconBrowser />
			</main>
		</>
	);
}

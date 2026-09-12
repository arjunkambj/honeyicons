import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/hero";
import { AgentTools, Community, Footer } from "@/components/home-sections";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	return (
		<div className="container mx-auto px-4 sm:px-6">
			<main>
				<Hero />
				<Community />
				<AgentTools />
			</main>
			<Footer />
		</div>
	);
}

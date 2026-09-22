import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/hero";
import { AgentTools, Community } from "@/components/home-sections";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	return (
		<main className="page-shell">
			<Hero />
			<Community />
			<AgentTools />
		</main>
	);
}

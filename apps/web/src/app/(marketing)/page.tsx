import { Hero } from "@/components/hero";
import { AgentTools, Community, Footer } from "@/components/home-sections";
import { Navbar } from "@/components/navbar";

export default function Home() {
	return (
		<>
			<Navbar />
			<div className="container mx-auto px-4 sm:px-6">
				<main>
					<Hero />
					<Community />
					<AgentTools />
				</main>
				<Footer />
			</div>
		</>
	);
}

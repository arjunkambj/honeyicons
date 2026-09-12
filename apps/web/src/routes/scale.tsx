import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/scale")({
	beforeLoad: () => {
		throw redirect({ to: "/icons" });
	},
});

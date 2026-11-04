import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DocsShell } from "@/components/docs/docs-shell";

export const Route = createFileRoute("/docs")({
	component: DocsLayout,
});

function DocsLayout() {
	return (
		<DocsShell>
			<Outlet />
		</DocsShell>
	);
}

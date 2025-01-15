import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/reference/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<Link
				to="/reference/$api_url"
				params={{ api_url: "get-access-list-for-organization" }}
			>
				Api URL Test
			</Link>
		</div>
	);
}

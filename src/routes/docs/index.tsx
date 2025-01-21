import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<Link
				to="$api_url"
				params={{ api_url: "get-access-list-for-organization" }}
				mask={{
					to: "/docs#get-access-list-for-organization",
					params: { api_url: "get-access-list-for-organization" },
				}}
			>
				Api URL Test
			</Link>
		</div>
	);
}

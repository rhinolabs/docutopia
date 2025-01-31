import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<Link
				to="$api_url"
				params={{ api_url: "get-a-list-of-access-for-an-organization" }}
				mask={{
					to: "/docs#get-a-list-of-access-for-an-organization",
					params: { api_url: "get-a-list-of-access-for-an-organization" },
				}}
			>
				Api URL Test
			</Link>
		</div>
	);
}

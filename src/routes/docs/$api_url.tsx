import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { mockApiData } from "@/mocks/api-data";
import { Badge } from "@rhino-ui/ui";
import { PathParams } from "@/components/api-docs/PathParams";
import { QueryParams } from "@/components/api-docs/QueryParams";
import { BodyParams } from "@/components/api-docs/BodyParams";
import { ResponseTypes } from "@/components/api-docs/ApiResponse";

export const Route = createFileRoute("/docs/$api_url")({
	component: RouteComponent,
	loader: async () => {
		const data = mockApiData;
		if (!data) {
			throw new Error("API not found");
		}
		return { data };
	},
});

function RouteComponent() {
	const { data } = useLoaderData({ from: "/docs/$api_url" });

	return (
		<>
			<div className="container py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2">
						<div className="head">
							<h1 className="text-2xl font-semibold mb-2">{data.name}</h1>
							<div className="text-sm text-muted-foreground overflow-x-scroll">
								<Badge className="mr-3 font-normal">{data.requestType}</Badge>
								{data.url}
							</div>
						</div>
						<div className="content">
							{data.pathParams && data.pathParams.length > 0 && (
								<PathParams pathParams={data.pathParams} />
							)}

							{data.queryParams && data.queryParams.length > 0 && (
								<QueryParams queryParams={data.queryParams} />
							)}

							{data.bodyParams && data.bodyParams.length > 0 && (
								<BodyParams bodyParams={data.bodyParams} />
							)}

							{data.response && data.response.length > 0 && (
								<ResponseTypes responses={data.response} />
							)}
						</div>
					</div>

					<div className="lg:col-span-1">
						<div className="sidebar bg-gray-100 p-4 rounded-md">
							<h2 className="text-xl font-semibold">Content</h2>
							<p>
								This is the sidebar content. It will take up 1/3 of the width on
								desktop.
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { mockApiData } from "@/mocks/api-data";
import { Badge } from "@rhino-ui/ui";
import { PathParams } from "@/components/api-docs/path-params";
import { QueryParams } from "@/components/api-docs/query-params";
import { BodyParams } from "@/components/api-docs/body-params";
import { ResponseTypes } from "@/components/api-docs/api-response";
import type { ApiDataParsed } from "@/types/api/data";
import type { ApiParameter } from "@/types/api/parameters";

async function loadApiData(): Promise<{ data: ApiDataParsed }> {
	const data = mockApiData;
	if (!data) {
		throw new Error("API not found");
	}
	return { data };
}

function ErrorBoundary({ error }: { error: Error }) {
	return (
		<div className="error">
			<h1 className="text-red-500">Error</h1>
			<p>{error.message}</p>
		</div>
	);
}

function classifyParameters(parameters: ApiParameter[]) {
	return parameters.reduce(
		(acc, param) => {
			acc[`${param.in}Params`].push(param);
			return acc;
		},
		{
			pathParams: [] as ApiParameter[],
			queryParams: [] as ApiParameter[],
			bodyParams: [] as ApiParameter[],
		},
	);
}

function RouteComponent() {
	const { data }: { data: ApiDataParsed } = useLoaderData({
		from: "/docs/$api_url",
	});
	const { pathParams, queryParams, bodyParams } = classifyParameters(
		data.parameters,
	);

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
							{pathParams.length > 0 && <PathParams pathParams={pathParams} />}

							{queryParams.length > 0 && (
								<QueryParams queryParams={queryParams} />
							)}

							{bodyParams.length > 0 && <BodyParams bodyParams={bodyParams} />}

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

export const Route = createFileRoute("/docs/$api_url")({
	component: RouteComponent,
	loader: loadApiData,
	errorComponent: ErrorBoundary,
});

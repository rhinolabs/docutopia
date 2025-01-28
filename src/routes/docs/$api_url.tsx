import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { mockOpenApiDoc } from "@/mocks/api-data";
import { Badge, Button } from "@rhino-ui/ui";
import { PathParams } from "@/components/api-docs/path-params";
import { QueryParams } from "@/components/api-docs/query-params";
import { BodyParams } from "@/components/api-docs/body-params";
import { ResponseTypes } from "@/components/api-docs/api-response";
import type {
	OpenApiDocument,
	OperationObject,
	ResponseEntry,
} from "@/types/api/openapi";
import { classifyParameters, getBodyParams } from "@/utils/api-helpers";
import { useMemo } from "react";

async function loadApiData(): Promise<{ data: OpenApiDocument }> {
	const data = mockOpenApiDoc;
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
			<Button onClick={() => window.location.reload()}>Reload</Button>
		</div>
	);
}

function RouteComponent() {
	const { data: doc } = useLoaderData({ from: "/docs/$api_url" });

	const operation: OperationObject | undefined =
		doc.paths["/organizations/{organizationId}/access"]?.get;

	if (!operation) {
		return (
			<div className="error-message">
				<h1 className="text-xl font-semibold">Operation Not Found</h1>
				<p>The requested API operation could not be found.</p>
			</div>
		);
	}

	// This will change after integrating the dynamic navigation
	const endpoint = `${doc.servers?.[0].url}/organizations/{organizationId}/access`;
	const requestType = "GET";

	const { pathParams, queryParams } = useMemo(() => {
		return classifyParameters(operation.parameters ?? []);
	}, [operation.parameters]);

	const bodySchema =
		operation.requestBody?.content?.["application/json"]?.schema;

	const bodyParams = useMemo(() => {
		return getBodyParams(bodySchema);
	}, [bodySchema]);

	const responseEntries: ResponseEntry[] = Object.entries(
		operation.responses,
	).map(([status, resp]) => ({
		status,
		description: resp.description,
		content: resp.content,
	}));

	return (
		<div className="container py-8">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2">
					<div className="head">
						<h1 className="text-2xl font-semibold mb-2">{operation.summary}</h1>
						<div className="text-sm text-muted-foreground overflow-x-scroll">
							<Badge className="mr-3 font-normal">{requestType}</Badge>
							{endpoint}
						</div>
					</div>
					<div className="content">
						{pathParams.length > 0 && <PathParams pathParams={pathParams} />}

						{queryParams.length > 0 && (
							<QueryParams queryParams={queryParams} />
						)}

						{bodyParams.length > 0 && <BodyParams bodyParams={bodyParams} />}

						{responseEntries.length > 0 && (
							<ResponseTypes responses={responseEntries} doc={doc} />
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
	);
}

export const Route = createFileRoute("/docs/$api_url")({
	component: RouteComponent,
	loader: loadApiData,
	errorComponent: ErrorBoundary,
});

import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { mockOpenApiDoc } from "@/mocks/api-data";
import { Badge } from "@rhino-ui/ui";
import { PathParams } from "@/components/api-docs/path-params";
import { QueryParams } from "@/components/api-docs/query-params";
import { BodyParams } from "@/components/api-docs/body-params";
import { ResponseTypes } from "@/components/api-docs/api-response";
import type {
	OpenApiDocument,
	OperationObject,
	ParameterObject,
	ParameterOrRef,
	ResponseEntry,
	SchemaOrRef,
} from "@/types/api/openapi";

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
		</div>
	);
}

function classifyParameters(parameters: ParameterOrRef[]) {
	const pathParams: ParameterObject[] = [];
	const queryParams: ParameterObject[] = [];

	for (const param of parameters) {
		if ("$ref" in param) {
			continue;
		}

		switch (param.in) {
			case "path":
				pathParams.push(param);
				break;
			case "query":
				queryParams.push(param);
				break;
			default:
				break;
		}
	}

	return { pathParams, queryParams };
}

function getBodyParams(schema: SchemaOrRef | undefined): ParameterObject[] {
	if (!schema || "$ref" in schema) {
		return [];
	}

	if (schema.type === "object" && schema.properties) {
		return Object.entries(schema.properties).map(([propName, propSchema]) => ({
			name: propName,
			in: "body",
			required: schema.required?.includes(propName) ?? false,
			schema: propSchema,
			description: propSchema.description,
		}));
	}
	return [];
}

function RouteComponent() {
	const { data: doc } = useLoaderData({
		from: "/docs/$api_url",
	});

	const operation: OperationObject | undefined =
		doc.paths["/organizations/{organizationId}/access"]?.get;

	if (!operation) {
		return <div>No operation found</div>;
	}

	const endpoint = `${doc.servers?.[0].url}/organizations/{organizationId}/access`;
	const requestType = "GET";

	const { pathParams, queryParams } = classifyParameters(
		operation.parameters ?? [],
	);

	const bodySchema =
		operation.requestBody?.content?.["application/json"]?.schema;
	const bodyParams = getBodyParams(bodySchema);

	const responseEntries: ResponseEntry[] = Object.entries(
		operation.responses,
	).map(([status, resp]) => ({
		status,
		description: resp.description,
		content: resp.content,
	}));

	return (
		<>
			<div className="container py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2">
						<div className="head">
							<h1 className="text-2xl font-semibold mb-2">
								{operation.summary}
							</h1>
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
		</>
	);
}

export const Route = createFileRoute("/docs/$api_url")({
	component: RouteComponent,
	loader: loadApiData,
	errorComponent: ErrorBoundary,
});

import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { mockOpenApiDoc } from "@/mocks/api-data";
import { Badge, Button } from "@rhino-ui/ui";
import { PathParams } from "@/components/api-docs/path-params";
import { QueryParams } from "@/components/api-docs/query-params";
import { BodyParams } from "@/components/api-docs/body-params";
import { ResponseTypes } from "@/components/api-docs/api-response";
import type {
	ApiLoaderData,
	EnhancedOperation,
	ResponseEntry,
} from "@/types/api/openapi";
import { classifyParameters, getBodyParams } from "@/utils/api/api-helpers";
import { useMemo } from "react";
import { slugifyOperation } from "@/utils/slugify-operation";
import type { LoaderArgs } from "@/types/api/loader";

/**
 * Loads API data based on the provided parameters.
 *
 * @param params - The parameters containing the api_url.
 * @returns The loaded API documentation data.
 */
async function loadApiData({
	params,
}: {
	params: { api_url: string };
}): Promise<ApiLoaderData> {
	let foundOperation: EnhancedOperation | undefined;

	for (const [path, pathItem] of Object.entries(mockOpenApiDoc.paths)) {
		for (const [method, operation] of Object.entries(pathItem)) {
			if (!operation) continue;

			const slug =
				slugifyOperation(operation.summary) ||
				`${method.toUpperCase()} ${path}`;

			if (slug === params.api_url) {
				foundOperation = {
					...operation,
					path,
					method: method.toUpperCase(),
				};
				break;
			}
		}

		if (foundOperation) break;
	}

	if (!foundOperation) {
		throw new Error(`API operation "${params.api_url}" not found`);
	}

	return {
		doc: mockOpenApiDoc,
		operation: foundOperation,
	};
}

/**
 * Error boundary component for handling loader errors.
 *
 * @param error - The error object.
 * @returns JSX element displaying the error message.
 */
function ErrorBoundary({ error }: { error: Error }) {
	return (
		<div className="p-8 text-center">
			<h1 className="text-2xl font-bold text-red-600 mb-4">
				Documentation Error
			</h1>
			<p className="text-muted-foreground mb-6">{error.message}</p>
			<Button variant="outline" onClick={() => window.location.reload()}>
				Reload Documentation
			</Button>
		</div>
	);
}

/**
 * Component responsible for rendering the API documentation based on the route.
 *
 * @returns JSX element displaying the API documentation.
 */
function RouteComponent() {
	const { doc, operation } = useLoaderData({
		from: "/docs/$api_url",
	}) as ApiLoaderData;

	if (!operation) {
		return (
			<div className="p-8 text-center">
				<h1 className="text-2xl font-bold mb-4">Operation Not Found</h1>
				<p className="text-muted-foreground">
					The requested API documentation could not be found.
				</p>
			</div>
		);
	}

	const endpoint = `${doc.servers?.[0].url}${operation.path}`;
	const requestType = operation.method;

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
	).map(([status, response]) => {
		if ("$ref" in response) {
			return {
				status,
				description: "Reference response",
				content: {},
				$ref: response.$ref,
			};
		}

		return {
			status,
			description: response.description,
			content: response.content || {},
		};
	});

	const { api_url } = Route.useParams();

	return (
		<div key={api_url} className="container py-8">
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

export const Route = createFileRoute<LoaderArgs, ApiLoaderData>(
	"/docs/$api_url",
)({
	component: RouteComponent,
	loader: async ({ params }: LoaderArgs) => {
		return loadApiData({ params });
	},
	errorComponent: ErrorBoundary,
});

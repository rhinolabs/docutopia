import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { Badge, Button, Separator, SidebarTrigger } from "@rhino-ui/ui";
import { PathParams } from "@/components/api-docs/path-params";
import { QueryParams } from "@/components/api-docs/query-params";
import { BodyParams } from "@/components/api-docs/body-params";
import { ResponseTypes } from "@/components/api-docs/api-response";
import type { EnhancedOperation, ResponseEntry } from "@/types/api/openapi";
import { classifyParameters, getBodyParams } from "@/utils/api/api-helpers";
import { useMemo } from "react";
import { slugifyOperation } from "@/utils/slugify-operation";
import { useOpenApi } from "@/contexts/open-api-context";

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
}): Promise<{ api_url: string }> {
	return { api_url: params.api_url };
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
	const { api_url } = useLoaderData({
		from: "/docs/$api_url",
	}) as { api_url: string };

	const { doc } = useOpenApi();
	let foundOperation: EnhancedOperation | undefined;

	for (const [path, pathItem] of Object.entries(doc.paths)) {
		for (const [method, operation] of Object.entries(pathItem)) {
			if (!operation) continue;
			const slug =
				slugifyOperation(operation.summary) ||
				`${method.toUpperCase()} ${path}`;
			if (slug === api_url) {
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
		return (
			<div className="p-8 text-center">
				<h1 className="text-2xl font-bold mb-4">Operation Not Found</h1>
				<p className="text-muted-foreground">
					The requested API documentation could not be found.
				</p>
			</div>
		);
	}

	const endpoint = `${doc.servers?.[0].url}${foundOperation.path}`;
	const requestType = foundOperation.method;

	const { pathParams, queryParams } = useMemo(() => {
		return classifyParameters(foundOperation.parameters ?? []);
	}, [foundOperation.parameters]);

	const bodySchema =
		foundOperation.requestBody?.content?.["application/json"]?.schema;

	const bodyParams = useMemo(() => {
		return getBodyParams(bodySchema);
	}, [bodySchema]);

	const responseEntries: ResponseEntry[] = Object.entries(
		foundOperation.responses,
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

	return (
		<div key={api_url} className="container px-6 py-8">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2">
					<div className="head">
						<SidebarTrigger className="pb-4" />
						<Separator />
						<h1 className="text-2xl font-semibold my-3">
							{foundOperation.summary}
						</h1>
						<div className="text-xs text-muted-foreground flex items-center overflow-x-scroll">
							<Badge className="mr-3 font-normal py-1 px-3">
								{requestType}
							</Badge>
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
	loader: async ({ params }) => {
		const typedParams = params as { api_url: string };
		return loadApiData({ params: typedParams });
	},
	errorComponent: ErrorBoundary,
});

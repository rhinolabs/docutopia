import { useParams } from "react-router-dom";
import { Badge, Separator, Sidebar } from "@rhinolabs/ui";
import { PathParams } from "@/components/api-docs/path-params";
import { QueryParams } from "@/components/api-docs/query-params";
import { BodyParams } from "@/components/api-docs/body-params";
import { ResponseTypes } from "@/components/api-docs/api-response";
import { TryApiPanel } from "@/components/api-docs/try-api-panel";
import type { EnhancedOperation, ResponseEntry } from "@/types/api/openapi";
import { classifyParameters, getBodyParams } from "@/utils/api/api-helpers";
import { useMemo } from "react";
import { slugifyOperation } from "@/utils/slugify-operation";
import { useOpenApi } from "@/contexts/open-api-context";

/**
 * Component responsible for rendering the API documentation based on the route.
 */
export function DocutopiaPage() {
	const { apiUrl } = useParams<{ apiUrl: string }>();
	const { doc } = useOpenApi();

	if (!apiUrl) {
		return (
			<div className="container px-6 py-8">
				<div className="text-center">
					<Sidebar.Trigger className="pb-4" />
					<Separator className="mb-8" />
					<h1 className="text-3xl font-bold mb-4">
						Welcome to API Documentation
					</h1>
					<p className="text-muted-foreground mb-6">
						Select an endpoint from the sidebar to view its documentation.
					</p>
				</div>
			</div>
		);
	}

	let foundOperation: EnhancedOperation | undefined;

	for (const [path, pathItem] of Object.entries(doc.paths)) {
		for (const [method, operation] of Object.entries(pathItem)) {
			if (!operation) continue;
			const slug =
				slugifyOperation(operation.summary) ||
				`${method.toUpperCase()} ${path}`;
			if (slug === apiUrl) {
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
		<div key={apiUrl} className="container px-6 py-8">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2">
					<div className="head">
						<Sidebar.Trigger className="pb-4" />
						<Separator />
						<h1 className="text-2xl font-semibold my-3">
							{foundOperation.summary}
						</h1>
						<div className="text-xs text-muted-foreground flex items-center overflow-x-scroll">
							<Badge className="mr-3 font-normal text-badge-foreground py-1 px-3">
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
					<TryApiPanel operation={foundOperation} />
				</div>
			</div>
		</div>
	);
}

import type React from "react";
import { useParams } from "react-router-dom";
import { useEndpointData } from "@/hooks/useEndpointData";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorDisplay } from "@/components/common/ErrorDisplay";
import { Badge, Separator, Sidebar } from "@rhinolabs/ui";
import { PathParams } from "@/components/api-docs/path-params";
import { QueryParams } from "@/components/api-docs/query-params";
import { BodyParams } from "@/components/api-docs/body-params";
import { ResponseTypes } from "@/components/api-docs/api-response";
import { TryApiPanel } from "@/components/try-api/TryApiPanel";
import { useOpenApiStore } from "@/stores/openapi-store";

export const DocutopiaPage: React.FC = () => {
	const { apiUrl } = useParams<{ apiUrl: string }>();
	const { spec } = useOpenApiStore();
	const { operation, parameters, bodyParams, isLoading, error } =
		useEndpointData(apiUrl);

	if (isLoading) {
		return <LoadingSpinner message="Loading API documentation..." />;
	}

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

	if (error || !operation) {
		return (
			<ErrorDisplay
				error={error || "Operation not found"}
				title="API Documentation Error"
			/>
		);
	}

	const endpoint = `${spec?.servers?.[0]?.url}${operation.path}`;
	const { pathParams, queryParams } = parameters;

	return (
		<div key={apiUrl} className="container px-6 py-8">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2">
					<div className="head">
						<Sidebar.Trigger className="pb-4" />
						<Separator />
						<h1 className="text-2xl font-semibold my-3">{operation.summary}</h1>
						<div className="text-xs text-muted-foreground flex items-center overflow-x-scroll">
							<Badge className="mr-3 font-normal bg-muted text-foreground py-1 px-3 border">
								{operation.method}
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
						{operation.responses && (
							<ResponseTypes
								responses={Object.entries(operation.responses).map(
									([status, response]) => ({
										status,
										description: response.description || "No description",
										content: response.content || {},
									}),
								)}
								// biome-ignore lint/style/noNonNullAssertion: `spec` is guaranteed to be defined here
								doc={spec!}
							/>
						)}
					</div>
				</div>
				<div className="lg:col-span-1">
					<TryApiPanel operation={operation} />
				</div>
			</div>
		</div>
	);
};

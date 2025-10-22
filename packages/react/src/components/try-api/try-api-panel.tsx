import type { EnhancedOperation } from "@/core/types";
import { useApiRequest, useAuth, useCurlGenerator } from "@/hooks";
import { useOpenApiStore } from "@/stores/openapi-store";
import { useRequestParamsStore } from "@/stores/request-params-store";
import { isAbsoluteUrlRegex, joinPaths } from "@/utils/url-helpers";
import { Badge, Button } from "@rhinolabs/ui";
import { CheckCircle, Loader2, Play, XCircle } from "lucide-react";
import { memo } from "react";
import { EnhancedCredentialsForm } from "./enhanced-credentials-form";
import { EnhancedCurlDisplay } from "./enhanced-curl-display";
import { ResponseDisplay } from "./response-display";

interface TryApiPanelProps {
	operation: EnhancedOperation;
	className?: string;
}

export const TryApiPanel = memo<TryApiPanelProps>(
	({ operation, className = "" }) => {
		const {
			credentials,
			isAuthenticated,
			generateAuthHeaders,
			generateAuthQuery,
		} = useAuth();
		const { params } = useRequestParamsStore();
		const { spec, baseUrl } = useOpenApiStore();

		const serverUrlFromSpec = spec?.servers?.[0]?.url ?? "";

		let endpointBaseUrl = serverUrlFromSpec;

		if (!isAbsoluteUrlRegex(serverUrlFromSpec) && baseUrl) {
			endpointBaseUrl = joinPaths(baseUrl, serverUrlFromSpec);
		}

		const { executeRequest, isLoading, response, error } =
			useApiRequest(endpointBaseUrl);

		// Generate cURL command with current settings
		const curlCommand = useCurlGenerator(operation, credentials, params, {
			baseUrl: endpointBaseUrl,
			prettify: true,
		});

		const handleTryRequest = async () => {
			try {
				const authHeaders = generateAuthHeaders();
				const authQuery = generateAuthQuery();

				// Convert params.query to strings and merge with auth query
				const queryParams: Record<string, string> = {};
				for (const [key, value] of Object.entries(params.query || {})) {
					if (value !== undefined && value !== null) {
						queryParams[key] = String(value);
					}
				}

				// Replace path parameters in the URL
				let requestPath = operation.path;
				for (const [key, value] of Object.entries(params.path || {})) {
					requestPath = requestPath.replace(`{${key}}`, String(value));
				}

				await executeRequest({
					method: operation.method,
					path: requestPath,
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						...authHeaders,
					},
					body: params.body,
					query: { ...queryParams, ...authQuery },
				});
			} catch (err) {
				console.error("Request failed:", err);
			}
		};

		return (
			<div className={`sticky top-4 h-fit space-y-6 ${className}`}>
				{/* Authentication Section */}
				<EnhancedCredentialsForm />

				{/* cURL Preview */}
				<EnhancedCurlDisplay curlCommand={curlCommand} title="cURL Request" />

				{/* Try It Button */}
				<div className="flex flex-col gap-3">
					<Button
						size="lg"
						onClick={handleTryRequest}
						disabled={isLoading || !isAuthenticated}
						className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoading ? (
							<>
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								Executing...
							</>
						) : (
							<>
								<Play className="h-4 w-4 mr-2" />
								Try It!
							</>
						)}
					</Button>

					{!isAuthenticated && (
						<p className="text-xs text-muted-foreground text-center">
							Configure authentication credentials to test this endpoint
						</p>
					)}
				</div>

				{/* Response Section - Directly below, no tabs */}
				{(response || error || isLoading) && (
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							{isLoading && (
								<Loader2 className="h-4 w-4 animate-spin text-blue-500" />
							)}
							{error && <XCircle className="h-4 w-4 text-red-500" />}
							{response && <CheckCircle className="h-4 w-4 text-green-500" />}
							<h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
								Response
							</h3>
							{response && (
								<Badge
									variant={response.status >= 400 ? "destructive" : "secondary"}
									className="text-xs"
								>
									{response.status}
								</Badge>
							)}
						</div>

						<ResponseDisplay
							response={response}
							error={error}
							operation={operation}
						/>
					</div>
				)}

				{/* Examples when no response yet */}
				{!response && !error && !isLoading && (
					<div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
						<p className="text-sm mb-3">
							Click "Try It!" to start a request and see the response here
						</p>
						<p className="text-xs mb-3">Or choose an example:</p>
						<div className="flex justify-center gap-2">
							<Badge
								variant="outline"
								className="cursor-pointer hover:bg-accent text-xs"
							>
								200 Success
							</Badge>
							<Badge
								variant="outline"
								className="cursor-pointer hover:bg-accent text-xs"
							>
								401 Unauthorized
							</Badge>
							<Badge
								variant="outline"
								className="cursor-pointer hover:bg-accent text-xs"
							>
								404 Not Found
							</Badge>
						</div>
					</div>
				)}
			</div>
		);
	},
);

TryApiPanel.displayName = "TryApiPanel";

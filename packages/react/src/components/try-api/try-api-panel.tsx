import { useOpenAPI, useRequestParams } from "@/contexts";
import type { EnhancedOperation } from "@/core/types";
import { useApiRequest, useAuth, useCurlGenerator } from "@/hooks";
import { isAbsoluteUrlRegex, joinPaths } from "@/utils/url-helpers";
import { Badge, Button } from "@rhinolabs/ui";
import { Loader2, Play } from "lucide-react";
import { memo, useState } from "react";
import { EnhancedCredentialsForm } from "./enhanced-credentials-form";
import { EnhancedCurlDisplay } from "./enhanced-curl-display";
import { ResponseDisplay } from "./response-display";
import { normalizeExampleResponse } from "@/utils/api/normalize-parameters";

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
		const { params } = useRequestParams();
		const { spec, baseUrl } = useOpenAPI();
		const serverUrlFromSpec = spec.servers?.[0]?.url ?? "";
		const [exampleRequest, setExampleRequest] = useState<string | null>(null);

		let endpointBaseUrl = serverUrlFromSpec;

		if (!isAbsoluteUrlRegex(serverUrlFromSpec) && baseUrl) {
			endpointBaseUrl = joinPaths(baseUrl, serverUrlFromSpec);
		}

		const { executeRequest, isLoading, response, error, clearResponse } =
			useApiRequest(endpointBaseUrl);

		// Generate cURL command with current settings
		const curlCommand = useCurlGenerator(operation, credentials, params, {
			baseUrl: endpointBaseUrl,
			prettify: true,
		});

		const getPathSecurity = () => {
			const rootSecurity = spec?.security || [];
			const pathSecurity = operation.security;

			if (pathSecurity) {
				return pathSecurity;
			}

			return rootSecurity;
		};

		const security = getPathSecurity();
		const disabledDueToAuth = security.length === 0 ? false : !isAuthenticated;

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
				setExampleRequest(null);
			} catch (err) {
				console.error("Request failed:", err);
			}
		};

		const getResponseExample = (statusCode: string) => {
			const content = operation.responses[statusCode]?.content;
			const schema = content ? content["application/json"]?.schema : undefined;
			if (!schema) return null;

			const normalizedSchema = normalizeExampleResponse(schema, spec);

			return normalizedSchema;
		};

		return (
			<div className={`sticky top-4 h-fit space-y-6 ${className}`}>
				{/* Authentication Section */}
				{security.length > 0 && <EnhancedCredentialsForm />}

				{/* cURL Preview */}
				<EnhancedCurlDisplay curlCommand={curlCommand} title="cURL Request" />

				{/* Try It Button */}
				<div className="flex flex-col gap-3">
					<Button
						size="lg"
						onClick={handleTryRequest}
						disabled={isLoading || disabledDueToAuth}
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

					{disabledDueToAuth && (
						<p className="text-xs text-muted-foreground text-center">
							Configure authentication credentials to test this endpoint
						</p>
					)}
				</div>

				{/* Response Section - Directly below, no tabs */}
				{(response || error || isLoading || exampleRequest) && (
					<ResponseDisplay
						response={response}
						error={error}
						operation={operation}
						exampleRequestStatusCode={exampleRequest}
						isLoading={isLoading}
						clearResponse={() => {
							setExampleRequest(null);
							clearResponse();
						}}
						getResponseExample={getResponseExample}
					/>
				)}

				{/* Examples when no response yet */}
				{!response && !error && !isLoading && !exampleRequest && (
					<div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
						<p className="text-sm mb-3">
							Click "Try It!" to start a request and see the response here
						</p>
						<p className="text-xs mb-3">Or choose an example:</p>
						<div className="flex justify-center gap-2">
							{Object.keys(operation.responses).map((statusCode) => (
								<Badge
									key={statusCode}
									variant="outline"
									className="cursor-pointer hover:bg-accent text-xs"
									onClick={() => {
										setExampleRequest(statusCode);
									}}
								>
									{statusCode}
								</Badge>
							))}
						</div>
					</div>
				)}
			</div>
		);
	},
);

TryApiPanel.displayName = "TryApiPanel";

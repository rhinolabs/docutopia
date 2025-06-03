import { memo, useState } from "react";
import { Button } from "@rhinolabs/ui";
import type { EnhancedOperation, RequestParameters } from "@/core/types";
import { useAuth, useApiRequest, useCurlGenerator } from "@/hooks";
import { CredentialsForm } from "./CredentialsForm";
import { CurlDisplay } from "./CurlDisplay";
import { ResponseDisplay } from "./ResponseDisplay";

interface TryApiPanelProps {
	operation: EnhancedOperation;
}

export const TryApiPanel = memo<TryApiPanelProps>(({ operation }) => {
	const { credentials } = useAuth();
	const { executeRequest, isLoading, response, error } = useApiRequest();
	const [parameters] = useState<RequestParameters>({ path: {}, query: {} });

	const curlCommand = useCurlGenerator(operation, credentials, parameters);

	const handleTryRequest = async () => {
		await executeRequest({
			method: operation.method,
			path: operation.path,
			headers: { "Content-Type": "application/json" },
			body: parameters.body,
		});
	};

	return (
		<div className="space-y-6">
			<CredentialsForm />
			<CurlDisplay curlCommand={curlCommand} />

			<div className="text-center">
				<Button
					size="lg"
					onClick={handleTryRequest}
					disabled={isLoading}
					className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
				>
					{isLoading ? "Executing..." : "Try It!"}
				</Button>
			</div>

			<ResponseDisplay
				response={response}
				error={error}
				operation={operation}
			/>
		</div>
	);
});

TryApiPanel.displayName = "TryApiPanel";

import { ErrorDisplay } from "@/components/common/error-display.tsx";
import { LoadingSpinner } from "@/components/common/loading-spinner.tsx";
import { EndpointDocumentation } from "@/components/endpoint-docs";
import { TryApiPanel } from "@/components/try-api/try-api-panel.tsx";
import { useEndpointData } from "@/hooks/use-endpoint-data";
import { useRequestParamsStore } from "@/stores/request-params-store";
import type React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const DocutopiaPage: React.FC = () => {
	const { apiUrl } = useParams<{ apiUrl: string }>();
	const { operation, parameters, bodyParams, isLoading, error } =
		useEndpointData(apiUrl);
	const { clearParams } = useRequestParamsStore();

	// Clear parameters when endpoint changes
	useEffect(() => {
		clearParams();
	}, [clearParams]);

	if (isLoading) {
		return <LoadingSpinner message="Loading API documentation..." />;
	}

	if (!apiUrl) {
		return (
			<div className="container px-6 py-8 h-full grid place-items-center">
				<div className="text-center">
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

	return (
		<div key={apiUrl} className="container px-6 py-8">
			<div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
				<EndpointDocumentation
					operation={operation}
					parameters={parameters}
					bodyParams={bodyParams}
				/>
				<div className="lg:col-span-3">
					<TryApiPanel operation={operation} />
				</div>
			</div>
		</div>
	);
};

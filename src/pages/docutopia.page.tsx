import type React from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useEndpointData } from "@/hooks/use-endpoint-data";
import { LoadingSpinner } from "@/components/common/loading-spinner.tsx";
import { ErrorDisplay } from "@/components/common/error-display.tsx";
import { Separator, Sidebar } from "@rhinolabs/ui";
import { EndpointDocumentation } from "@/components/endpoint-docs";
import { TryApiPanel } from "@/components/try-api/try-api-panel.tsx";
import { useRequestParamsStore } from "@/stores/request-params-store";

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

	return (
		<div key={apiUrl} className="container px-6 py-8">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<EndpointDocumentation
					operation={operation}
					parameters={parameters}
					bodyParams={bodyParams}
				/>
				<div className="lg:col-span-1">
					<TryApiPanel operation={operation} />
				</div>
			</div>
		</div>
	);
};

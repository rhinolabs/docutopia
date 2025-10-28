import { ErrorDisplay } from "@/components/common/error-display";
import { EndpointDocumentation } from "@/components/endpoint-docs";
import { TryApiPanel } from "@/components/try-api/try-api-panel";
import { useRequestParams } from "@/contexts";
import { useEndpointData } from "@/hooks/use-endpoint-data";
import { useRouting } from "@/routing/context";
import { Sidebar } from "@rhinolabs/ui";
import type React from "react";
import { useEffect } from "react";

export const DocutopiaPage: React.FC = () => {
	const routing = useRouting();
	const { apiUrl } = routing.useRouteParams();
	const { operation, parameters, bodyParams, error, spec } =
		useEndpointData(apiUrl);
	const { clearParams } = useRequestParams();

	// Clear parameters when endpoint changes
	useEffect(() => {
		clearParams();
	}, [clearParams]);

	if (!apiUrl) {
		return (
			<div className="container h-full">
				<header className="flex justify-between items-center border-b py-3 px-6">
					<span className="font-medium">Docutopia</span>
					<Sidebar.Trigger className="lg:hidden" variant="secondary" />
				</header>
				<main className="h-full grid place-items-center py-3 px-6">
					<div className="text-center">
						<h1 className="text-3xl font-bold mb-4">
							Welcome to API Documentation
						</h1>
						<p className="text-muted-foreground mb-6">
							Select an endpoint from the sidebar to view its documentation.
						</p>
					</div>
				</main>
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
		<div key={apiUrl} className="container h-full">
			<header className="flex gap-3 items-center border-b py-3 px-5 lg:hidden">
				<Sidebar.Trigger variant="outline" className="size-9" />
				<div className="flex flex-col">
					<span className="truncate font-medium text-sm">
						{spec.info.title || "Docutopia"}
					</span>
					<span className="text-xs text-muted-foreground">
						{spec.info.version}
					</span>
				</div>
			</header>
			<main className="grid grid-cols-1 lg:grid-cols-20 gap-8 px-6 py-4 lg:py-7">
				<EndpointDocumentation
					operation={operation}
					parameters={parameters}
					bodyParams={bodyParams}
				/>
				<div className="lg:col-span-7">
					<TryApiPanel operation={operation} />
				</div>
			</main>
		</div>
	);
};

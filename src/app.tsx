import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Sidebar } from "@rhinolabs/ui";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { useOpenApiStore } from "@/stores/openapi-store";
import { DocutopiaPage } from "@/pages/docutopia.page.tsx";

export function App() {
	const { loadSpec, isLoading, error } = useOpenApiStore();
	const specUrl = "https://petstore3.swagger.io/api/v3/openapi.json";

	// biome-ignore lint/correctness/useExhaustiveDependencies: Load spec only once on mount
	useEffect(() => {
		loadSpec(specUrl);
	}, []);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
					<p>Loading API Documentation...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center text-red-500">
					<p>Error loading API documentation:</p>
					<p className="text-sm mt-2">{error}</p>
				</div>
			</div>
		);
	}

	return (
		<Sidebar.Provider>
			<AppSidebar />
			<Sidebar.Inset>
				<Routes>
					<Route index element={<DocutopiaPage />} />
					<Route path=":apiUrl" element={<DocutopiaPage />} />
				</Routes>
			</Sidebar.Inset>
		</Sidebar.Provider>
	);
}

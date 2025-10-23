import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { DocutopiaPage } from "@/pages/docutopia.page.tsx";
import { useOpenApiStore } from "@/stores/openapi-store";
import { Sidebar } from "@rhinolabs/ui";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

export interface AppProps {
	specUrl: string;
	baseUrl: string;
}

export function App({ specUrl, baseUrl }: AppProps) {
	const { loadSpec, isLoading, error } = useOpenApiStore();

	// biome-ignore lint/correctness/useExhaustiveDependencies: Load spec only once on mount
	useEffect(() => {
		loadSpec(specUrl, baseUrl);
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
		<Sidebar.Provider className="">
			<AppSidebar collapsible="none" className="min-h-screen h-auto" />
			<Sidebar.Inset className="items-center">
				<Routes>
					<Route index element={<DocutopiaPage />} />
					<Route path=":apiUrl" element={<DocutopiaPage />} />
				</Routes>
			</Sidebar.Inset>
		</Sidebar.Provider>
	);
}

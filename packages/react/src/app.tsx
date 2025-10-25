import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { DocutopiaPage } from "@/pages/docutopia.page";
import { useRouting } from "@/routing/context";
import { useOpenApiStore } from "@/stores/openapi-store";
import { useWindowSize } from "@rhinolabs/react-hooks";
import { Sidebar } from "@rhinolabs/ui";
import { useEffect } from "react";

export interface AppProps {
	specUrl: string;
	baseUrl: string;
}

export function App({ specUrl, baseUrl }: AppProps) {
	const { loadSpec, isLoading, error } = useOpenApiStore();
	const { isDesktop } = useWindowSize();
	const routing = useRouting();

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

	// For SPA routers (React Router), use Routes/Route
	// For file-based routers (Next.js), render page directly
	const content = routing.Routes && routing.Route ? (
		<routing.Routes>
			<routing.Route index element={<DocutopiaPage />} />
			<routing.Route path=":apiUrl" element={<DocutopiaPage />} />
		</routing.Routes>
	) : (
		<DocutopiaPage />
	);

	return (
		<Sidebar.Provider className="">
			<AppSidebar
				collapsible={isDesktop ? "none" : "offcanvas"}
				className="min-h-screen h-auto"
			/>
			<Sidebar.Inset className="items-center">{content}</Sidebar.Inset>
		</Sidebar.Provider>
	);
}

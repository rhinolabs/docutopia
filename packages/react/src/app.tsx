"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { DocutopiaPage } from "@/pages/docutopia.page";
import { useRouting } from "@/routing/context";
import { Sidebar } from "@rhinolabs/ui";

/**
 * Main App component
 *
 * This component is now stateless and simply renders the UI.
 * The OpenAPI spec is provided via OpenAPIContext.
 */
export function App() {
	// SSR-safe: Don't use useWindowSize() since it accesses window during module load
	// Default to desktop (collapsible: "none") for simplicity
	const routing = useRouting();

	// For SPA routers (React Router), use Routes/Route
	// For file-based routers (Next.js), render page directly
	const content =
		routing.Routes && routing.Route ? (
			<routing.Routes>
				<routing.Route index element={<DocutopiaPage />} />
				<routing.Route path=":apiUrl" element={<DocutopiaPage />} />
			</routing.Routes>
		) : (
			<DocutopiaPage />
		);

	return (
		<Sidebar.Provider className="">
			<AppSidebar collapsible="none" className="min-h-screen h-auto" />
			<Sidebar.Inset className="items-center">{content}</Sidebar.Inset>
		</Sidebar.Provider>
	);
}

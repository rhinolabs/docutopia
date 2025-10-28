import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { DocutopiaPage } from "@/pages/docutopia.page";
import { useRouting } from "@/routing/context";
import { useWindowSize } from "@rhinolabs/react-hooks";
import { Sidebar } from "@rhinolabs/ui";

/**
 * Main App component
 *
 * This component is now stateless and simply renders the UI.
 * The OpenAPI spec is provided via OpenAPIContext.
 */
export function App() {
	const { isDesktop } = useWindowSize();
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
			<AppSidebar
				collapsible={isDesktop ? "none" : "offcanvas"}
				className="min-h-screen h-auto"
			/>
			<Sidebar.Inset className="items-center">{content}</Sidebar.Inset>
		</Sidebar.Provider>
	);
}

import { Outlet } from "react-router-dom";
import { Sidebar } from "@rhinolabs/ui";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { OpenApiProvider } from "@/contexts/open-api-context";

// To-do: set an env variable to manage this path with the CLI
const specPath = "/specs/openapi.json";

export function App() {
	return (
		<OpenApiProvider specPath={specPath}>
			<Sidebar.Provider>
				<AppSidebar />
				<Sidebar.Inset>
					<Outlet />
				</Sidebar.Inset>
			</Sidebar.Provider>
		</OpenApiProvider>
	);
}

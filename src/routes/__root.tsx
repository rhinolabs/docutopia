import { createRootRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarInset } from "@rhino-ui/ui";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { OpenApiProvider } from "@/contexts/open-api-context";

// To-do: set an env variable to manage this path with the CLI
const specPath = "/specs/openapi.json";

export const Route = createRootRoute({
	component: () => (
		<OpenApiProvider specPath={specPath}>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<Outlet />
				</SidebarInset>
				<TanStackRouterDevtools />
			</SidebarProvider>
		</OpenApiProvider>
	),
});

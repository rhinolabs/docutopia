import { createRootRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarInset } from "@rhino-ui/ui";
import { AppSidebar } from "@/components/sidebar/AppSidebar";

import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
	component: () => (
		<>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<Outlet />
				</SidebarInset>
			</SidebarProvider>
			<TanStackRouterDevtools />
		</>
	),
});

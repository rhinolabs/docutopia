import { useSidebarData } from "@/hooks/use-sidebar-data";
import { Sidebar } from "@rhinolabs/ui";
import type React from "react";
import { memo } from "react";
import { SidebarContent } from "./sidebar-content";
import { SidebarHeader } from "./sidebar-header";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {}

export const AppSidebar = memo<AppSidebarProps>((props) => {
	const { collections, specInfo } = useSidebarData();

	return (
		<Sidebar {...props}>
			<Sidebar.Header>
				<SidebarHeader
					title={specInfo.title || "Docutopia"}
					version={specInfo.version}
					serversCount={specInfo.serversCount || 0}
				/>
				<SidebarContent
					collections={collections}
					specTitle={specInfo.title || "API"}
				/>
			</Sidebar.Header>
			<Sidebar.Rail />
		</Sidebar>
	);
});

AppSidebar.displayName = "AppSidebar";

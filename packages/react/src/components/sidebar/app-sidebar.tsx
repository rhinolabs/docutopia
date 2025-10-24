import { useSidebarData } from "@/hooks/use-sidebar-data";
import { Sidebar } from "@rhinolabs/ui";
import type React from "react";
import { memo } from "react";
import { SidebarContent } from "./sidebar-content";
import { SidebarError } from "./sidebar-error";
import { SidebarHeader } from "./sidebar-header";
import { SidebarLoading } from "./sidebar-loading";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {}

export const AppSidebar = memo<AppSidebarProps>((props) => {
	const { collections, isLoading, error, specInfo } = useSidebarData();

	if (isLoading) {
		return (
			<Sidebar {...props}>
				<SidebarLoading />
			</Sidebar>
		);
	}

	if (error) {
		return (
			<Sidebar {...props}>
				<SidebarError error={error} />
			</Sidebar>
		);
	}

	return (
		<Sidebar {...props}>
			<Sidebar.Header>
				<SidebarHeader
					title={specInfo?.title || "Docutopia"}
					version={specInfo?.version}
					serversCount={specInfo?.serversCount || 0}
				/>
				<SidebarContent
					collections={collections}
					specTitle={specInfo?.title || "API"}
				/>
			</Sidebar.Header>
			<Sidebar.Rail />
		</Sidebar>
	);
});

AppSidebar.displayName = "AppSidebar";

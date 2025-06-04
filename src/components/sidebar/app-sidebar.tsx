import type React from "react";
import { memo } from "react";
import { Sidebar } from "@rhinolabs/ui";
import { useSidebarData } from "@/hooks/use-sidebar-data";
import { SidebarHeader } from "./sidebar-header.tsx";
import { SidebarContent } from "./sidebar-content.tsx";
import { SidebarLoading } from "./sidebar-loading.tsx";
import { SidebarError } from "./sidebar-error.tsx";

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

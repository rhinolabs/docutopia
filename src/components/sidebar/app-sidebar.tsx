import type React from "react";
import { memo } from "react";
import { Sidebar } from "@rhinolabs/ui";
import { useSidebarData } from "@/hooks/useSidebarData";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarContent } from "./SidebarContent";
import { SidebarLoading } from "./SidebarLoading";
import { SidebarError } from "./SidebarError";

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
					title={specInfo.title}
					version={specInfo.version}
					serversCount={specInfo.serversCount}
				/>
				<SidebarContent
					collections={collections}
					specTitle={specInfo.title}
				/>
			</Sidebar.Header>
			<Sidebar.Rail />
		</Sidebar>
	);
});

AppSidebar.displayName = "AppSidebar";

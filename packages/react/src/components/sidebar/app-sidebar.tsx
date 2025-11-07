import { useSidebarData } from "@/hooks/use-sidebar-data";
import { useWindowSize } from "@rhinolabs/react-hooks";
import { Sidebar } from "@rhinolabs/ui";
import type React from "react";
import { memo } from "react";
import { SearchBar } from "../search-bar/search-bar";
import { SidebarContent } from "./sidebar-content";
import { SidebarHeader } from "./sidebar-header";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {}

export const AppSidebar = memo<AppSidebarProps>(({ className, ...props }) => {
	const { collections, specInfo } = useSidebarData();
	const { isDesktop } = useWindowSize();

	return (
		<aside className="md:w-(--sidebar-width)">
			<Sidebar
				{...props}
				collapsible={isDesktop ? "none" : "offcanvas"}
				className={`${className || ""} flex flex-col h-screen fixed top-0 left-0 dark:bg-sidebar-background bg-zinc-100`}
			>
				<Sidebar.Header>
					<SidebarHeader
						title={specInfo.title || "Docutopia"}
						version={specInfo.version}
						serversCount={specInfo.serversCount || 0}
					/>
					<Sidebar.Menu>
						<Sidebar.MenuItem>
							<SearchBar navItems={collections} />
						</Sidebar.MenuItem>
					</Sidebar.Menu>
				</Sidebar.Header>
				<SidebarContent
					collections={collections}
					specTitle={specInfo.title || "API"}
				/>
				<Sidebar.Rail />
			</Sidebar>
		</aside>
	);
});

AppSidebar.displayName = "AppSidebar";

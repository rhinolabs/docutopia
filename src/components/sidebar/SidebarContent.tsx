import type React from "react";
import { Sidebar } from "@rhinolabs/ui";
import type { SidebarCollection } from "@/types/components/sidebar";
import { SearchBar } from "../search-bar/search-bar";
import { NavMain } from "./nav-main";

interface SidebarContentProps {
	collections: SidebarCollection[];
	specTitle: string;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
	collections,
	specTitle,
}) => {
	return (
		<>
			<Sidebar.MenuItem>
				<SearchBar navItems={collections} />
			</Sidebar.MenuItem>

			<Sidebar.Content>
				<NavMain items={collections} />
			</Sidebar.Content>
		</>
	);
};

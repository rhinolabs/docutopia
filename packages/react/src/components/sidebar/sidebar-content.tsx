import type { SidebarCollection } from "@/types/components/sidebar";
import { Sidebar } from "@rhinolabs/ui";
import type React from "react";
import { NavMain } from "./nav-main";

interface SidebarContentProps {
	collections: SidebarCollection[];
	specTitle: string;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
	collections,
}) => {
	return (
		<Sidebar.Content className="thin-scrollbar flex-1">
			<NavMain items={collections} />
		</Sidebar.Content>
	);
};

import { Sidebar } from "@rhinolabs/ui";
import { CommandIcon } from "lucide-react";
import type React from "react";

interface SidebarHeaderProps {
	title: string;
	version?: string;
	serversCount?: number;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
	title,
	version,
	serversCount,
}) => {
	return (
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton
					size="lg"
					className="data-(state=open):bg-sidebar-accent data-(state=open):text-sidebar-accent-foreground"
				>
					<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground mr-2">
						<CommandIcon className="size-4" />
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">{title}</span>
						{version && (
							<span className="text-xs text-muted-foreground">
								v{version} • {serversCount || 0} servers
							</span>
						)}
					</div>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	);
};

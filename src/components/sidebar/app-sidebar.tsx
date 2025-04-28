"use client";

import type * as React from "react";
import { CommandIcon } from "lucide-react";

import { NavMain } from "./nav-main";
import { Sidebar } from "@rhinolabs/ui";

import { SearchBar } from "../search-bar/search-bar";
import { useOpenApi } from "@/contexts/open-api-context";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { doc } = useOpenApi();
	const sidebarData = doc.sidebar;

	return (
		<Sidebar {...props}>
			<Sidebar.Header>
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
								<span className="truncate font-semibold">Docutopia</span>
							</div>
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
					<Sidebar.MenuItem>
						<SearchBar navItems={sidebarData} />
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.Header>

			<Sidebar.Content>
				<NavMain items={sidebarData} />
			</Sidebar.Content>
			<Sidebar.Rail />
		</Sidebar>
	);
}

"use client";

import type * as React from "react";

import { Command } from "lucide-react";

import { NavMain } from "./nav-main";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from "@rhino-ui/ui";

import { mockOpenApiDoc } from "@/mocks/api-data";
import { transformOpenApiToSidebar } from "@/utils/api/openapi-adapter";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const sidebarData = transformOpenApiToSidebar(mockOpenApiDoc);

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							className="data-(state=open):bg-sidebar-accent data-(state=open):text-sidebar-accent-foreground"
						>
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground mr-2">
								<Command className="size-4" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">Docutopia</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<NavMain items={sidebarData} />
			</SidebarContent>
		</Sidebar>
	);
}

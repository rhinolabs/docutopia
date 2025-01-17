"use client";

import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { getRequestTypeClass } from "@/utils/requestType";
import type { SidebarCollection } from "@/types/sidebar";

import {
	Badge,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@rhino-ui/ui";

export function NavMain({
	items,
}: {
	items: SidebarCollection[];
}) {
	return (
		<SidebarGroup>
			<SidebarMenu>
				{items.map((collection, collectionIndex) => (
					<div key={collection.collectionName}>
						{collection.collectionName && (
							<h4
								className={`text-[12px] text-[#3F3F46] font-medium ${collectionIndex > 0 ? "mt-5" : ""}`}
							>
								{collection.collectionName}
							</h4>
						)}

						{collection.requests.map((request) => (
							<Collapsible
								key={request.title}
								asChild
								defaultOpen={request.isActive}
								className="group/collapsible"
							>
								<SidebarMenuItem>
									{request.items && request.items.length > 0 ? (
										<>
											<CollapsibleTrigger asChild>
												<SidebarMenuButton tooltip={request.title}>
													<span>{request.title}</span>
													<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
												</SidebarMenuButton>
											</CollapsibleTrigger>
											<CollapsibleContent>
												<SidebarMenuSub className="border-0 px-0">
													{request.items.map((subItem) => (
														<SidebarMenuSubItem
															className="my-1"
															key={subItem.title}
														>
															<SidebarMenuSubButton className="h-auto" asChild>
																<Link
																	to={subItem.url}
																	className="[&.active]:font-bold"
																>
																	<span>{subItem.title}</span>
																	<Badge
																		className={`${getRequestTypeClass(subItem.requestType)} text-[10px] rounded-md h-[17px] px-3`}
																	>
																		{subItem.requestType}
																	</Badge>
																</Link>
															</SidebarMenuSubButton>
														</SidebarMenuSubItem>
													))}
												</SidebarMenuSub>
											</CollapsibleContent>
										</>
									) : (
										<SidebarMenuButton asChild>
											<Link to={request.url} className="[&.active]:font-bold">
												<span>{request.title}</span>
											</Link>
										</SidebarMenuButton>
									)}
								</SidebarMenuItem>
							</Collapsible>
						))}
					</div>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}

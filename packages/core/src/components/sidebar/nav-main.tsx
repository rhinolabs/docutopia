"use client";

import type { SidebarCollection } from "@/types/components/sidebar";
import { getRequestTypeClass } from "@/utils/api/request-type";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge, Collapsible, Sidebar } from "@rhinolabs/ui";

export function NavMain({
	items,
}: {
	items: SidebarCollection[];
}) {
	return (
		<Sidebar.Group>
			<Sidebar.Menu>
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
								key={request.name}
								asChild
								defaultOpen={request.isActive}
								className="group/collapsible"
							>
								<Sidebar.MenuItem>
									{request.items && request.items.length > 0 ? (
										<>
											<Collapsible.Trigger asChild>
												<Sidebar.MenuButton tooltip={request.name}>
													<span>{request.name}</span>
													<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
												</Sidebar.MenuButton>
											</Collapsible.Trigger>
											<Collapsible.Content>
												<Sidebar.MenuSub className="border-0 px-0">
													{request.items.map((subItem) => (
														<Sidebar.MenuSubItem
															className="my-1"
															key={subItem.name}
														>
															<Sidebar.MenuSubButton className="h-auto" asChild>
																<Link
																	to={`/${subItem.url}`}
																	className="[&.active]:font-bold"
																>
																	<span>{subItem.name}</span>
																	<Badge
																		className={`${getRequestTypeClass(subItem.requestType)} text-white text-[10px] h-[17px] px-3 font-medium`}
																	>
																		{subItem.requestType.toUpperCase()}
																	</Badge>
																</Link>
															</Sidebar.MenuSubButton>
														</Sidebar.MenuSubItem>
													))}
												</Sidebar.MenuSub>
											</Collapsible.Content>
										</>
									) : (
										<Sidebar.MenuButton asChild>
											<Link
												to={`/${request.url}`}
												className="[&.active]:font-bold"
											>
												<span>{request.name}</span>
											</Link>
										</Sidebar.MenuButton>
									)}
								</Sidebar.MenuItem>
							</Collapsible>
						))}
					</div>
				))}
			</Sidebar.Menu>
		</Sidebar.Group>
	);
}

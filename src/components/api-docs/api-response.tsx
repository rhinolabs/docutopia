import {
	Button,
	Card,
	CardContent,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@rhino-ui/ui";
import type { ResponseTypesProps } from "@/types/api/responses";
import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

export const ResponseTypes = ({ responses }: ResponseTypesProps) => {
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const handleToggle = (index: number) => {
		setOpenIndex((prevIndex) => (prevIndex === index ? null : index)); // Toggle logic
	};

	return (
		<>
			<div className="mt-5">
				<h3 className="text-sm font-semibold mb-4">RESPONSE</h3>
				<Card className="bg-primary-foreground border shadow-sm rounded-lg">
					<CardContent className="py-2 px-0">
						{responses.map((response, index) => (
							<Collapsible
								key={`${response.status}-card`}
								open={openIndex === index}
								onOpenChange={() => handleToggle(index)}
								className={index > 0 ? "border-t" : ""}
							>
								<div className="flex items-center justify-between space-x-4 px-4 py-3">
									<CollapsibleTrigger asChild>
										<div className="flex justify-between items-center w-full cursor-pointer">
											<div>
												<div className="flex items-center">
													<span
														className={`rounded-full h-3 w-3 mr-2 ${
															response.success ? "bg-green-500" : "bg-red-500"
														}`}
													/>
													<h4 className="text-xs font-medium">
														{response.status}
													</h4>
												</div>
												<p className="text-xs text-muted-foreground mt-2">
													{response.message}
												</p>
											</div>
											<Button variant="ghost" size="sm" className="w-9 p-0">
												{openIndex === index ? (
													<ChevronDown className="h-4 w-4 text-muted-foreground" />
												) : (
													<ChevronRight className="h-4 w-4 text-muted-foreground" />
												)}
												<span className="sr-only">Toggle</span>
											</Button>
										</div>
									</CollapsibleTrigger>
								</div>
								<CollapsibleContent>
									<div className="px-4 py-4 border-t">
										<h4 className="text-sm font-medium text-muted-foreground">
											RESPONSE BODY
										</h4>
										{!response.success && (
											<Card className="bg-primary-foreground border shadow-none rounded-lg mt-2">
												<CardContent className="p-0">
													{response.schema && (
														<>
															<div className="p-4">
																<p className="text-sm font-medium text-muted-foreground">
																	object
																</p>
															</div>
															<div>
																{Object.entries(response.schema).map(
																	([key, value]) => (
																		<div key={key} className="mb-2">
																			<hr />
																			<div className="px-4 py-2">
																				<span className="text-xs font-semibold mr-1">
																					{key}
																				</span>
																				<span className="text-xs text-muted-foreground mr-1">
																					{value.type}
																					{value.items &&
																						` of ${value.items.type}`}
																				</span>
																				{value.required && (
																					<span className="text-xs text-red-500">
																						required
																					</span>
																				)}
																			</div>
																		</div>
																	),
																)}
															</div>
														</>
													)}
													{!response.schema && (
														<div className="px-4 pt-6">
															<p className="text-sm text-muted-foreground">
																Empty Response
															</p>
														</div>
													)}
												</CardContent>
											</Card>
										)}
									</div>
								</CollapsibleContent>
							</Collapsible>
						))}
					</CardContent>
				</Card>
			</div>
		</>
	);
};

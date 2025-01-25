import {
	Button,
	Card,
	CardContent,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@rhino-ui/ui";
import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import type {
	ResponseEntry,
	MediaTypeObject,
	OpenApiDocument,
} from "@/types/api/openapi";
import { ParamField } from "../ui/fields";
import { mapSchemaToParamField } from "@/utils/map-schema-to-param-field";
import { resolveRef } from "@/utils/resolve-ref";

interface ResponseTypesProps {
	responses: ResponseEntry[];
	doc: OpenApiDocument;
}

export const ResponseTypes: React.FC<ResponseTypesProps> = ({
	responses,
	doc,
}) => {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const handleToggle = (index: number) => {
		setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
	};

	const isSuccess = (status: string) => status.startsWith("2");

	return (
		<div className="mt-5">
			<h3 className="text-sm font-semibold mb-4">RESPONSE</h3>
			<Card className="bg-primary-foreground border shadow-sm rounded-lg">
				<CardContent className="py-2 px-0">
					{responses.map((response, index) => {
						const success = isSuccess(response.status);

						return (
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
															response.status.startsWith("2")
																? "bg-green-500"
																: "bg-red-500"
														}`}
													/>
													<h4 className="text-xs font-medium">
														{response.status}
													</h4>
												</div>
												<p className="text-xs text-muted-foreground mt-2">
													{response.description}
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
										{!success && (
											<Card className="bg-primary-foreground border shadow-none rounded-lg mt-2">
												<CardContent className="p-0">
													{response.content &&
													Object.keys(response.content).length > 0 ? (
														Object.entries(response.content).map(
															([mediaType, mediaObject]: [
																string,
																MediaTypeObject,
															]) => {
																if (!mediaObject.schema) {
																	return (
																		<div key={mediaType} className="mb-2">
																			<p className="text-xs text-muted-foreground">
																				No content available.
																			</p>
																		</div>
																	);
																}

																if ("$ref" in mediaObject.schema) {
																	const referencedSchema = resolveRef(
																		mediaObject.schema.$ref,
																		doc,
																	);
																	if (referencedSchema?.properties) {
																		return (
																			<div>
																				<p className="text-sm font-medium text-muted-foreground px-6 py-4">
																					{String(
																						referencedSchema.type ??
																							"Unknown type",
																					)}
																				</p>
																				{Object.entries(
																					referencedSchema.properties,
																				).map(([key, value]) => (
																					<div key={key}>
																						<hr />
																						<ParamField
																							key={key}
																							field={mapSchemaToParamField(
																								key,
																								value,
																								referencedSchema.required?.includes(
																									key,
																								) ?? false,
																							)}
																							readOnly={true}
																						/>
																					</div>
																				))}
																			</div>
																		);
																	}
																} else {
																	return (
																		<div key={mediaType} className="mb-2">
																			<p className="px-4 text-sm text-muted-foreground">
																				No properties available.
																			</p>
																		</div>
																	);
																}
															},
														)
													) : (
														<div className="px-4 py-6">
															<p className="text-sm text-muted-foreground">
																No content available.
															</p>
														</div>
													)}
												</CardContent>
											</Card>
										)}
									</div>
								</CollapsibleContent>
							</Collapsible>
						);
					})}
				</CardContent>
			</Card>
		</div>
	);
};

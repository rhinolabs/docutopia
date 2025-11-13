import { useRequestParams } from "@/contexts";
import type { ParameterObject, SchemaObject, SchemaOrRef } from "@/core/types";
import { asSchemaObject } from "@/utils/type-guards";
import { Button, Collapsible, Separator } from "@rhinolabs/ui";
import { ChevronRight } from "lucide-react";
import { Fragment, useState } from "react";
import { ParamField } from "./fields";

/**
 * Combines allOf schema objects into a single merged schema object
 */
const combineAllOfSchemas = (
	allOfSchemas: (SchemaObject | SchemaOrRef)[],
): SchemaObject => {
	const combinedSchema: SchemaObject = {
		type: "object",
		properties: {},
		required: [],
	};

	for (const schemaOrRef of allOfSchemas) {
		const schema = asSchemaObject(schemaOrRef);
		if (!schema) continue;

		// Merge properties
		if (schema.properties) {
			combinedSchema.properties = {
				...combinedSchema.properties,
				...schema.properties,
			};
		}

		// Merge required arrays
		if (schema.required) {
			const existingRequired = combinedSchema.required || [];
			combinedSchema.required = [
				...existingRequired,
				...schema.required.filter((req) => !existingRequired.includes(req)),
			];
		}

		// Merge other schema properties (description, title, etc.)
		if (schema.description && !combinedSchema.description) {
			combinedSchema.description = schema.description;
		}
	}

	return combinedSchema;
};

interface CombineSchemaObjectFieldProps {
	schema: SchemaObject;
	field: ParameterObject;
	name: string;
	defaultOpen?: boolean;
	readOnly?: boolean;
	paramType?: "path" | "query" | "body";
	bodyPath: (string | number)[];
}

export const CombineSchemaObjectField = ({
	field,
	schema,
	...props
}: CombineSchemaObjectFieldProps) => {
	const combineSchemas =
		field.combineSchemas || schema.oneOf
			? "oneOf"
			: schema.anyOf
				? "anyOf"
				: schema.allOf
					? "allOf"
					: undefined;

	if (combineSchemas === "oneOf") {
		return (
			<OneOfObjectField
				field={{ ...field, combineSchemas }}
				schema={schema}
				{...props}
			/>
		);
	}

	if (combineSchemas === "anyOf") {
		return (
			<OneOfObjectField
				field={{ ...field, combineSchemas }}
				schema={schema}
				{...props}
			/>
		);
	}

	if (combineSchemas === "allOf") {
		return (
			<AllOfObjectField
				field={{ ...field, combineSchemas }}
				schema={schema}
				{...props}
			/>
		);
	}

	return <span>Unsuported combinedSchema</span>;
};

export const OneOfObjectField = ({
	field,
	bodyPath,
	readOnly,
	name,
}: CombineSchemaObjectFieldProps) => {
	const [schemaSelectedIndex, setSchemaSelectedIndex] = useState<number>(0);
	const { deleteParamAtPath } = useRequestParams();
	const combineSchemas = field.combineSchemas;

	if (!combineSchemas || !field.schema) {
		return null;
	}

	const changeSelectedIndex = (index: number) => {
		setSchemaSelectedIndex(index);
		// Clear params when switching schemas
		deleteParamAtPath(bodyPath);
	};

	return (
		<div className="col-span-4">
			<Collapsible open={true} className="border  rounded-lg bg-card">
				<div className="flex items-center justify-between space-x-4 px-3 py-1">
					<Collapsible.Trigger asChild>
						<div className="flex justify-between items-center w-full cursor-pointer">
							<h4 className="text-sm font-semibold py-2">
								{name.toUpperCase()} OBJECT
							</h4>

							<span className="text-xs text-muted-foreground">
								{combineSchemas} the following objects
							</span>
						</div>
					</Collapsible.Trigger>
				</div>
				<Collapsible.Content>
					<div className="">
						{field.schema[combineSchemas]?.length === 0 && (
							<div className="pt-2 pb-4 px-6">
								<span className="text-pretty text-muted-foreground text-sm mx-auto">
									No schemas available.
								</span>
							</div>
						)}
						{field.schema[combineSchemas]?.map((subSchema, index) => {
							const propertyEntries = subSchema.properties
								? Object.entries(subSchema.properties)
								: [];

							const isOpen = schemaSelectedIndex === index;

							return (
								<Fragment key={`${index}-${subSchema.type}`}>
									<Separator />
									<Collapsible
										open={isOpen}
										onOpenChange={() => changeSelectedIndex(index)}
									>
										<Collapsible.Trigger asChild>
											<div
												className={`flex justify-between items-center w-full cursor-pointer px-4 ${isOpen ? "bg-gray-100" : ""}`}
											>
												<h4 className="text-sm font-semibold">
													Schema {index}
												</h4>
												<Button variant="ghost" size="sm" className="w-9 p-0">
													<ChevronRight
														className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`}
													/>
													<span className="sr-only">Toggle</span>
												</Button>
											</div>
										</Collapsible.Trigger>
										<Collapsible.Content>
											{propertyEntries.map(([propName, subSchemaOrRef]) => {
												const fieldSchema = asSchemaObject(subSchemaOrRef);
												if (!subSchema) return null;
												// Construct nested bodyPath for this property
												const nestedBodyPath =
													bodyPath.length > 0
														? [...bodyPath, propName]
														: [propName];

												return (
													<Fragment key={propName}>
														<Separator />
														<ParamField
															field={{
																name: propName,
																in: "body",
																required:
																	subSchema.required?.includes(propName) ??
																	false,
																schema: fieldSchema,
																description: fieldSchema?.description,
															}}
															readOnly={readOnly}
															bodyPath={nestedBodyPath}
														/>
													</Fragment>
												);
											})}
										</Collapsible.Content>
									</Collapsible>
								</Fragment>
							);
						})}
					</div>
				</Collapsible.Content>
			</Collapsible>
		</div>
	);
};

export const AllOfObjectField = ({
	bodyPath,
	readOnly,
	name,
	field,
}: CombineSchemaObjectFieldProps) => {
	if (!field.schema || !field.schema.allOf) {
		return null;
	}

	// Combine all the allOf schemas into a single schema object
	const combinedSchema = combineAllOfSchemas(field.schema.allOf);

	// Get property entries from the combined schema
	const propertyEntries = combinedSchema.properties
		? Object.entries(combinedSchema.properties)
		: [];

	if (propertyEntries.length === 0) {
		return (
			<div className="col-span-4 p-4 text-center text-muted-foreground text-sm">
				No properties available in combined schema.
			</div>
		);
	}

	return (
		<div className="col-span-4">
			<Collapsible open={true} className="border rounded-lg bg-card">
				<div className="flex items-center justify-between space-x-4 px-3 py-1">
					<Collapsible.Trigger asChild>
						<div className="flex justify-between items-center w-full cursor-pointer">
							<h4 className="text-sm font-semibold py-2">
								{name.toUpperCase()} OBJECT
							</h4>
							<span className="text-xs text-muted-foreground">
								Combined from {field.schema.allOf.length} schemas
							</span>
						</div>
					</Collapsible.Trigger>
				</div>
				<Collapsible.Content>
					<div className="space-y-0">
						{propertyEntries.map(([propName, subSchemaOrRef]) => {
							const subSchema = asSchemaObject(subSchemaOrRef);
							if (!subSchema) return null;

							// Construct nested bodyPath for this property
							const nestedBodyPath =
								bodyPath.length > 0
									? [...bodyPath, propName]
									: [name, propName];

							return (
								<Fragment key={propName}>
									<Separator />
									<ParamField
										field={{
											name: propName,
											in: "body",
											required:
												combinedSchema.required?.includes(propName) ?? false,
											schema: subSchema,
											description: subSchema.description,
										}}
										readOnly={readOnly}
										bodyPath={nestedBodyPath}
									/>
								</Fragment>
							);
						})}
					</div>
				</Collapsible.Content>
			</Collapsible>
		</div>
	);
};

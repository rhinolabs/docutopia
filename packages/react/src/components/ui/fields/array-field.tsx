import type { SchemaObject } from "@/types/api/openapi";
import { mapSchemaToParamField } from "@/utils/fields/map-schema-to-param-field";
import { asSchemaObject } from "@/utils/type-guards";
import { Card, Collapsible, Separator } from "@rhinolabs/ui";
import { useMemo } from "react";
import { DynamicFields } from "../dynamic-fields";
import { DynamicObjectFields } from "../dynamic-object-fields";
import { ParamField } from "./param-field";

interface ArrayFieldProps {
	field: SchemaObject;
	name?: string;
	readOnly?: boolean;
	paramType?: "path" | "query" | "body";
	bodyPath?: (string | number)[];
}

export const ArrayField: React.FC<ArrayFieldProps> = ({
	field,
	name = "items",
	readOnly = false,
	paramType: _paramType = "body",
	bodyPath = [],
}) => {
	const items = asSchemaObject(field.items);
	const itemsType = items?.type;

	// Array of objects
	if (itemsType === "object" && items) {
		if (readOnly) {
			// Show read-only schema representation
			const arrayBodyPath = bodyPath.length > 0 ? [...bodyPath] : [name];

			return (
				<div className="col-span-4">
					<Card className="shadow-none bg-card/60">
						<Collapsible>
							<div className="">
								<Collapsible.Trigger asChild>
									<div className="w-full cursor-pointer">
										<p className="text-sm font-medium text-muted-foreground px-6 py-4">
											{String(itemsType?.toUpperCase() ?? "Unknown type")}{" "}
											(Schema - Read Only)
										</p>
									</div>
								</Collapsible.Trigger>
								<Collapsible.Content>
									{Object.entries(items.properties ?? {}).map(
										([propertyKey, propertyObj]) => {
											const propSchema = asSchemaObject(propertyObj);
											if (!propSchema) return null;

											return (
												<div key={propertyKey} className="">
													<Separator />
													<ParamField
														field={mapSchemaToParamField(
															propertyKey,
															propSchema,
															items.required?.includes(propertyKey) ?? false,
														)}
														readOnly={true}
														bodyPath={[...arrayBodyPath, 0, propertyKey]}
													/>
												</div>
											);
										},
									)}
								</Collapsible.Content>
							</div>
						</Collapsible>
					</Card>
				</div>
			);
		}

		// Editable array of objects
		const arrayBodyPath = bodyPath.length > 0 ? [...bodyPath] : [name];

		return (
			<div className="col-span-4">
				<DynamicObjectFields itemSchema={items} bodyPath={arrayBodyPath} />
			</div>
		);
	}

	// Array of primitive types (e.g. strings, numbers, boolean)
	if (
		itemsType === "string" ||
		itemsType === "integer" ||
		itemsType === "boolean"
	) {
		if (readOnly) {
			return;
		}

		const options = useMemo(() => {
			if (items && Array.isArray(items.enum)) {
				return (items.enum ?? []).map(String);
			}
			return [];
		}, [items]);

		const hasOptions = options.length > 0;

		// Construct bodyPath for this array
		const arrayBodyPath = bodyPath.length > 0 ? [...bodyPath] : [name];

		return (
			<div className="col-span-4">
				<DynamicFields
					hasOptions={hasOptions}
					options={options}
					bodyPath={arrayBodyPath}
				/>
			</div>
		);
	}

	console.warn(
		"ArrayField: Unsupported field type or missing 'items' property.",
	);
	return null;
};

import type { SchemaObject } from "@/types/api/openapi";
import { mapSchemaToParamField } from "@/utils/fields/map-schema-to-param-field";
import { asSchemaObject } from "@/utils/type-guards";
import { Card, Collapsible, Separator } from "@rhinolabs/ui";
import { useMemo } from "react";
import { DynamicFields } from "../dynamic-fields";
import { ParamField } from "./param-field";

interface ArrayFieldProps {
	field: SchemaObject;
	name?: string;
	readOnly?: boolean;
	paramType?: "path" | "query" | "body";
	bodyPath?: string[];
}

export const ArrayField: React.FC<ArrayFieldProps> = ({
	field,
	readOnly = false,
	// paramType and bodyPath not used yet, but needed for type compatibility
}) => {
	const items = asSchemaObject(field.items);
	const itemsType = items?.type;

	// Array of objects
	if (itemsType === "object" && items) {
		return (
			<div className="col-span-4">
				<Card className="shadow-none bg-card">
					<Collapsible>
						<div className="">
							<Collapsible.Trigger asChild>
								<div className="w-full cursor-pointer">
									<p className="text-sm font-medium text-muted-foreground px-6 py-4">
										{String(itemsType?.toUpperCase() ?? "Unknown type")}
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

		return (
			<div className="col-span-4">
				<DynamicFields hasOptions={hasOptions} options={options} />
			</div>
		);
	}

	console.warn(
		"ArrayField: Unsupported field type or missing 'items' property.",
	);
	return null;
};

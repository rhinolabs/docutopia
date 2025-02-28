import { mapSchemaToParamField } from "@/utils/fields/map-schema-to-param-field";
import { DynamicFields } from "../dynamic-fields";
import type { SchemaObject } from "@/types/api/openapi";
import { ParamField } from "./param-field";
import { Separator, Collapsible, Card } from "@rhinolabs/ui";
import { useMemo } from "react";

interface ArrayFieldProps {
	field: SchemaObject;
	readOnly?: boolean;
}

export const ArrayField: React.FC<ArrayFieldProps> = ({
	field,
	readOnly = false,
}) => {
	const itemsType = field.items?.type;

	// Array of objects
	if (field.items?.type === "object") {
		return (
			<div className="col-span-4">
				<Card className="shadow-none bg-primary-foreground">
					<Collapsible>
						<div className="">
							<Collapsible.Trigger asChild>
								<div className="w-full cursor-pointer">
									<p className="text-sm font-medium text-muted-foreground px-6 py-4">
										{String(field.items.type.toUpperCase() ?? "Unknown type")}
									</p>
								</div>
							</Collapsible.Trigger>
							<Collapsible.Content>
								{Object.entries(field.items.properties ?? {}).map(
									([propertyKey, propertyObj]) => {
										return (
											<div key={propertyKey} className="">
												<Separator />
												<ParamField
													field={mapSchemaToParamField(
														propertyKey,
														propertyObj as SchemaObject,
														field.items?.required?.includes(propertyKey) ??
															false,
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
			if (field.items && Array.isArray(field.items.enum)) {
				return (field.items.enum ?? []).map(String);
			}
			return [];
		}, [field.items]);

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

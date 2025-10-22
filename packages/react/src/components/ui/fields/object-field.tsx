import type { SchemaObject } from "@/types/api/openapi";
import { asSchemaObject } from "@/utils/type-guards";
import { Button, Collapsible, Separator } from "@rhinolabs/ui";
import { Plus } from "lucide-react";
import { useState } from "react";
import React from "react";
import { ParamField } from "./param-field";

interface ObjectFieldProps {
	field: SchemaObject;
	name: string;
	defaultOpen?: boolean;
	readOnly?: boolean;
	paramType?: "path" | "query" | "body";
	bodyPath?: string[];
}

const isObjectField = (field: SchemaObject): boolean =>
	field.type === "object" && !!field.properties;

export const ObjectField: React.FC<ObjectFieldProps> = ({
	field,
	name,
	defaultOpen = false,
	readOnly = false,
	paramType = "body",
	bodyPath = [],
}) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	if (!isObjectField(field)) {
		return null;
	}

	const propertyEntries = field.properties
		? Object.entries(field.properties)
		: [];

	if (propertyEntries.length === 0) {
		return null;
	}

	return (
		<div className="col-span-4">
			<Collapsible
				open={isOpen}
				onOpenChange={setIsOpen}
				className="border  rounded-lg bg-card"
			>
				<div className="flex items-center justify-between space-x-4 px-4 py-2">
					<Collapsible.Trigger asChild>
						<div className="flex justify-between items-center w-full cursor-pointer">
							<h4 className="text-sm font-semibold">
								{name.toUpperCase()} OBJECT
							</h4>
							<Button variant="ghost" size="sm" className="w-9 p-0">
								<Plus className="h-4 w-4 text-muted-foreground" />
								<span className="sr-only">Toggle</span>
							</Button>
						</div>
					</Collapsible.Trigger>
				</div>
				<Collapsible.Content>
					{propertyEntries.map(([propName, subSchemaOrRef]) => {
						const subSchema = asSchemaObject(subSchemaOrRef);
						if (!subSchema) return null;

						// Construct nested bodyPath for this property
						const nestedBodyPath =
							bodyPath.length > 0 ? [...bodyPath, propName] : [name, propName];

						return (
							<React.Fragment key={propName}>
								<Separator />
								<ParamField
									field={{
										name: propName,
										in: "body",
										required: field.required?.includes(propName) ?? false,
										schema: subSchema,
										description: subSchema.description,
									}}
									readOnly={readOnly}
									bodyPath={nestedBodyPath}
								/>
							</React.Fragment>
						);
					})}
				</Collapsible.Content>
			</Collapsible>
		</div>
	);
};

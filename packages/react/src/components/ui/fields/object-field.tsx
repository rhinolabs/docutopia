import type { SchemaObject, SchemaOrRef } from "@/types/api/openapi";
import { asSchemaObject } from "@/utils/type-guards";
import { Button, Collapsible, Separator } from "@rhinolabs/ui";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import React from "react";
import { ParamField } from "./param-field";
import { CustomObjectField } from "../custom-object-field";

interface ObjectFieldProps {
	field: SchemaObject;
	name: string;
	defaultOpen?: boolean;
	readOnly?: boolean;
	paramType?: "path" | "query" | "body";
	bodyPath?: (string | number)[];
}

const isObjectField = (field: SchemaObject): boolean => field.type === "object";

interface SchemaObjectFieldProps {
	propertyEntries: [string, SchemaOrRef][];
	bodyPath: (string | number)[];
	field: SchemaObject;
	readOnly: boolean;
	name: string;
}

const SchemaObjectField: React.FC<SchemaObjectFieldProps> = ({
	propertyEntries,
	bodyPath,
	field,
	readOnly,
	name,
}) => {
	return propertyEntries.map(([propName, subSchemaOrRef]) => {
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
	});
};

export const ObjectField: React.FC<ObjectFieldProps> = ({
	field,
	name,
	defaultOpen = false,
	readOnly = false,
	paramType: _paramType = "body",
	bodyPath = [],
}) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	if (!isObjectField(field)) {
		return null;
	}

	const hasSchemaProperties = !!field.properties;

	const propertyEntries = field.properties
		? Object.entries(field.properties)
		: [];

	return (
		<div className="col-span-4">
			<Collapsible
				open={isOpen}
				onOpenChange={setIsOpen}
				className="border  rounded-lg bg-card"
			>
				<div className="flex items-center justify-between space-x-4 px-3 py-1">
					<Collapsible.Trigger asChild>
						<div className="flex justify-between items-center w-full cursor-pointer">
							<h4 className="text-sm font-semibold">
								{name.toUpperCase()} OBJECT
							</h4>
							<Button variant="ghost" size="sm" className="w-9 p-0">
								<ChevronRight
									className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`}
								/>
								<span className="sr-only">Toggle</span>
							</Button>
						</div>
					</Collapsible.Trigger>
				</div>
				<Collapsible.Content>
					<div className="overflow-hidden rounded-b-lg bg-background/50">
						{hasSchemaProperties ? (
							<SchemaObjectField
								propertyEntries={propertyEntries}
								bodyPath={bodyPath}
								field={field}
								readOnly={readOnly}
								name={name}
							/>
						) : (
							<CustomObjectField
								bodyPath={bodyPath}
								field={field}
								readOnly={readOnly}
								name={name}
							/>
						)}
					</div>
				</Collapsible.Content>
			</Collapsible>
		</div>
	);
};

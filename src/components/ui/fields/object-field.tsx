import {
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@rhino-ui/ui";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ParamField } from "./param-field";
import type { SchemaObject } from "@/types/api/openapi";
import React from "react";

interface ObjectFieldProps {
	field: SchemaObject;
	name: string;
	defaultOpen?: boolean;
}

const isObjectField = (field: SchemaObject): boolean =>
	field.type === "object" && !!field.properties;

export const ObjectField: React.FC<ObjectFieldProps> = ({
	field,
	name,
	defaultOpen = false,
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
				className="border rounded-lg bg-white"
			>
				<div className="flex items-center justify-between space-x-4 px-4 py-2">
					<CollapsibleTrigger asChild>
						<div className="flex justify-between items-center w-full cursor-pointer">
							<h4 className="text-sm font-semibold">
								{name.toUpperCase()} OBJECT
							</h4>
							<Button variant="ghost" size="sm" className="w-9 p-0">
								<Plus className="h-4 w-4 text-muted-foreground" />
								<span className="sr-only">Toggle</span>
							</Button>
						</div>
					</CollapsibleTrigger>
				</div>
				<CollapsibleContent>
					{propertyEntries.map(([propName, subSchema]) => (
						<React.Fragment key={propName}>
							<hr />
							<ParamField
								field={{
									name: propName,
									in: "body",
									required: field.required?.includes(propName) ?? false,
									schema: subSchema,
									description: subSchema.description,
								}}
							/>
						</React.Fragment>
					))}
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
};

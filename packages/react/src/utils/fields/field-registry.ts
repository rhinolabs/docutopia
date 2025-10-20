import { ArrayField } from "@/components/ui/fields/array-field";
import { BooleanField } from "@/components/ui/fields/boolean-field";
import { IntegerField } from "@/components/ui/fields/integer-field";
import { ObjectField } from "@/components/ui/fields/object-field";
import { StringField } from "@/components/ui/fields/string-field";
import type { SchemaObject } from "@/types/api/openapi";
import type React from "react";

type FieldComponent = React.FC<{
	field: SchemaObject;
	name: string;
	readOnly?: boolean;
	paramType?: "path" | "query" | "body";
	bodyPath?: string[];
}>;

const fieldRegistry: Record<string, FieldComponent> = {};

export const registerFieldType = (type: string, component: FieldComponent) => {
	fieldRegistry[type] = component;
};

export const getFieldComponent = (type: string): FieldComponent | null => {
	return fieldRegistry[type] || null;
};

registerFieldType("string", StringField);
registerFieldType("integer", IntegerField);
registerFieldType("number", IntegerField); // number uses same component as integer
registerFieldType("boolean", BooleanField);
registerFieldType("array", ArrayField);
registerFieldType("object", ObjectField);

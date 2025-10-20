import type React from "react";
import { StringField } from "@/components/ui/fields/string-field";
import { IntegerField } from "@/components/ui/fields/integer-field";
import { ArrayField } from "@/components/ui/fields/array-field";
import { ObjectField } from "@/components/ui/fields/object-field";
import type { SchemaObject } from "@/types/api/openapi";

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
registerFieldType("array", ArrayField);
registerFieldType("object", ObjectField);

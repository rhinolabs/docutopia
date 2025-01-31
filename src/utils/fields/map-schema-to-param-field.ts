import type { SchemaObject, ParameterObject } from "@/types/api/openapi";

export const mapSchemaToParamField = (
	name: string,
	schema: SchemaObject,
	required: boolean,
): ParameterObject => ({
	name,
	in: "response",
	required,
	schema,
	description: schema.description || "",
});

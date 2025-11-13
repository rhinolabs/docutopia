import type { ReferenceObject, SchemaObject } from "./schemas";

export type ParameterOrRef = ParameterObject | ReferenceObject;

export interface ParameterObject {
	name: string;
	in: "path" | "query" | "header" | "cookie" | "body" | "response";
	required?: boolean;
	schema?: SchemaObject;
	combineSchemas?: "oneOf" | "anyOf" | "allOf";
	description?: string;
}

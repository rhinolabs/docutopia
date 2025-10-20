import type { SchemaObject, SchemaOrRef } from "@/types/api/openapi";

/**
 * Type guard to check if a schema is a SchemaObject (not a reference)
 */
export function isSchemaObject(
	schema: SchemaOrRef | undefined,
): schema is SchemaObject {
	return schema !== undefined && !("$ref" in schema);
}

/**
 * Safely get a SchemaObject from a SchemaOrRef
 * Returns undefined if it's a reference (which shouldn't happen after normalization)
 */
export function asSchemaObject(
	schema: SchemaOrRef | undefined,
): SchemaObject | undefined {
	return isSchemaObject(schema) ? schema : undefined;
}

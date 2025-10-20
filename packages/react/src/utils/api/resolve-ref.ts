import type { OpenApiDocument, SchemaObject } from "@/types/api/openapi";

interface RefObject {
	$ref: string;
}

const isSchemaObject = (obj: unknown): obj is SchemaObject => {
	if (typeof obj !== "object" || obj === null) return false;

	// A valid SchemaObject can have any of these properties
	// Note: 'type' is optional in OpenAPI - it can be inferred from other properties
	const validProps = [
		"type",
		"properties",
		"items",
		"enum",
		"format",
		"description",
		"required",
		"default",
		"example",
		"pattern",
		"minimum",
		"maximum",
		"minLength",
		"maxLength",
	];

	return validProps.some((prop) => prop in obj);
};

export const resolveRef = (
	ref: string,
	doc: OpenApiDocument,
	visitedRefs: Set<string> = new Set(),
): SchemaObject | undefined => {
	if (visitedRefs.has(ref)) {
		console.warn(`Circular reference detected: ${ref}`);
		return undefined;
	}

	visitedRefs.add(ref);

	const parts = ref.replace(/^#\//, "").split("/");
	let current: unknown = doc;

	for (const part of parts) {
		if (typeof current === "object" && current !== null && part in current) {
			current = (current as Record<string, unknown>)[part];
		} else {
			console.warn(`Reference ${ref} could not be resolved.`);
			return undefined;
		}
	}

	if (typeof current === "object" && current !== null && "$ref" in current) {
		const nestedRef = (current as RefObject).$ref;

		if (typeof nestedRef === "string") {
			return resolveRef(nestedRef, doc, visitedRefs);
		}
	}

	if (isSchemaObject(current)) {
		return current;
	}

	console.warn(`Resolved reference does not conform to SchemaObject: ${ref}`);
	return undefined;
};

import type {
	OpenApiDocument,
	ParameterObject,
	SchemaObject,
	SchemaOrRef,
} from "@/types/api/openapi";
import { resolveRef } from "./resolve-ref";

/**
 * Infers the type of a schema when type is not explicitly defined
 */
function inferSchemaType(schema: SchemaObject): string {
	// If type is already defined, return it
	if (schema.type) return schema.type;

	// Infer from other properties
	if (schema.properties) return "object";
	if (schema.items) return "array";
	if (schema.enum) return "string";

	// Default fallback
	return "string";
}

/**
 * Normalizes a schema by resolving references and inferring types
 */
function normalizeSchema(
	schemaOrRef: SchemaOrRef,
	spec: OpenApiDocument,
	fieldName = "unknown",
): SchemaObject {
	// Resolve $ref if present
	let schema: SchemaObject;
	if ("$ref" in schemaOrRef) {
		const resolved = resolveRef(schemaOrRef.$ref, spec);
		if (!resolved) {
			console.warn(
				`Failed to resolve reference: ${schemaOrRef.$ref} for field: ${fieldName}`,
			);
			return { type: "string", description: "Unresolved reference" };
		}
		schema = resolved;
	} else {
		schema = schemaOrRef;
	}

	// Ensure type is defined (infer if needed)
	const type = inferSchemaType(schema);

	// Recursively normalize nested schemas
	const normalizedSchema: SchemaObject = {
		...schema,
		type,
	};

	// Normalize properties if it's an object
	if (normalizedSchema.properties) {
		const normalizedProps: Record<string, SchemaObject> = {};
		for (const [propName, propSchema] of Object.entries(
			normalizedSchema.properties,
		)) {
			normalizedProps[propName] = normalizeSchema(propSchema, spec, propName);
		}
		// Cast to SchemaOrRef for type compatibility, but we know they're all SchemaObject
		normalizedSchema.properties = normalizedProps as Record<
			string,
			SchemaOrRef
		>;
	}

	// Normalize items if it's an array
	if (normalizedSchema.items) {
		// Cast to SchemaOrRef for type compatibility, but we know it's SchemaObject
		normalizedSchema.items = normalizeSchema(
			normalizedSchema.items,
			spec,
			`${fieldName}[]`,
		) as SchemaOrRef;
	}

	return normalizedSchema;
}

/**
 * Extracts and normalizes body parameters from a request body schema
 * Similar to generateSidebarFromSpec, this centralizes parameter processing
 */
export function normalizeBodyParams(
	schema: SchemaOrRef | undefined,
	spec: OpenApiDocument,
): ParameterObject[] {
	if (!schema) {
		return [];
	}

	// Normalize the root schema
	const normalizedSchema = normalizeSchema(schema, spec, "body");

	// Extract properties if it's an object
	if (normalizedSchema.type === "object" && normalizedSchema.properties) {
		return Object.entries(normalizedSchema.properties).map(
			([propName, propSchemaOrRef]) => {
				// Properties are already normalized SchemaObject, but TypeScript doesn't know
				const propSchema = propSchemaOrRef as SchemaObject;

				const param: ParameterObject = {
					name: propName,
					in: "body",
					required: normalizedSchema.required?.includes(propName) ?? false,
					schema: propSchema,
					description: propSchema.description,
				};

				return param;
			},
		);
	}

	// If the body is not an object, log a warning
	console.warn(
		`Body schema is not an object type: ${normalizedSchema.type}. Expected object with properties.`,
	);
	return [];
}

/**
 * Normalizes path and query parameters by resolving their schemas
 */
export function normalizeParameter(
	param: ParameterObject,
	spec: OpenApiDocument,
): ParameterObject {
	if (!param.schema) {
		return param;
	}

	return {
		...param,
		schema: normalizeSchema(param.schema, spec, param.name),
	};
}

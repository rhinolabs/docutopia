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
	if (schema.properties || schema.oneOf || schema.anyOf || schema.allOf)
		return "object";
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

	// Normalize combined schemas if present
	if (normalizedSchema.oneOf) {
		normalizedSchema.oneOf = normalizedSchema.oneOf.map((subSchema, index) =>
			normalizeSchema(subSchema, spec, `${fieldName}.oneOf[${index}]`),
		);
	}
	if (normalizedSchema.anyOf) {
		normalizedSchema.anyOf = normalizedSchema.anyOf.map((subSchema, index) =>
			normalizeSchema(subSchema, spec, `${fieldName}.anyOf[${index}]`),
		);
	}
	if (normalizedSchema.allOf) {
		normalizedSchema.allOf = normalizedSchema.allOf.map((subSchema, index) =>
			normalizeSchema(subSchema, spec, `${fieldName}.allOf[${index}]`),
		);
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

	if (
		normalizedSchema.oneOf ||
		normalizedSchema.anyOf ||
		normalizedSchema.allOf
	) {
		const combineSchemas = normalizedSchema.oneOf
			? "oneOf"
			: normalizedSchema.anyOf
				? "anyOf"
				: "allOf";

		const name = normalizedSchema.oneOf
			? "One of"
			: normalizedSchema.anyOf
				? "Any of"
				: "All of";

		const param: ParameterObject = {
			in: "body",
			combineSchemas,
			name,
			schema: normalizedSchema,
		};

		return [param];
	}

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
 * Extracts and normalizes example parameter from a response body schema
 * Similar to generateSidebarFromSpec, this centralizes parameter processing
 */
export function normalizeExampleResponse(
	schema: SchemaOrRef | undefined,
	spec: OpenApiDocument,
): Record<string, unknown> {
	if (!schema) {
		return {};
	}

	if ("example" in schema) {
		return schema.example as Record<string, unknown>;
	}

	// Normalize the root schema
	const normalizedSchema = normalizeSchema(schema, spec);
	let schemaToProcess: Record<string, SchemaOrRef> | undefined = undefined;

	// Extract properties if it's an object
	if (normalizedSchema.type === "object" && normalizedSchema.properties) {
		schemaToProcess = normalizedSchema.properties;
	}

	if (normalizedSchema.type === "array" && normalizedSchema.items) {
		schemaToProcess = {
			items: normalizedSchema,
		};
	}

	if (schemaToProcess) {
		const normalizedProps = Object.entries(schemaToProcess).map(
			([propName, propSchemaOrRef]) => {
				// Properties are already normalized SchemaObject, but TypeScript doesn't know
				const propSchema = propSchemaOrRef as SchemaObject;

				if (propSchema.type === "object") {
					const nestedExamples = normalizeExampleResponse(propSchema, spec);
					return {
						name: propName,
						example: nestedExamples,
					};
				}

				if (propSchema.type === "array") {
					if (!propSchema.items) {
						return {
							name: propName,
							example: [],
						};
					}

					const itemSchema = normalizeSchema(propSchema.items, spec);

					if (itemSchema.type === "object") {
						const nestedExamples = normalizeExampleResponse(itemSchema, spec);
						return {
							name: propName,
							example: [nestedExamples],
						};
					}

					if (!itemSchema.example) {
						return {
							name: propName,
							example: itemSchema.type ? [itemSchema.type] : [],
						};
					}

					return {
						name: propName,
						example: [itemSchema.example],
					};
				}
				const exampleResponse = {
					name: propName,
					example: propSchema.example || propSchema.type || "undefined",
				};

				return exampleResponse;
			},
		);

		return parseParametersToObject(normalizedProps);
	}

	// If the response is not an object, log a warning
	console.warn(
		`Response schema is not an object nor an array type: ${normalizedSchema.type}. Expected object with properties.`,
	);
	return {};
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

/**
 * Parses an array of parameter objects with name and example properties
 * into a flat object structure
 */
export function parseParametersToObject(
	parameters: Array<{ name: string; example: unknown }>,
): Record<string, unknown> {
	const result: Record<string, unknown> = {};

	for (const param of parameters) {
		if (
			Array.isArray(param.example) &&
			param.example.every(
				(p) => typeof p === "object" && !!p.name && !!p.example,
			)
		) {
			// If example is an array of parameter objects, recursively parse it
			result[param.name] = parseParametersToObject(param.example);
		} else {
			// Otherwise, use the example value directly
			result[param.name] = param.example;
		}
	}

	return result;
}

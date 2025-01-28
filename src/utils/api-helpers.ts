import type {
	ParameterObject,
	ParameterOrRef,
	SchemaOrRef,
} from "@/types/api/openapi";

export function classifyParameters(parameters: ParameterOrRef[]) {
	const pathParams: ParameterObject[] = [];
	const queryParams: ParameterObject[] = [];

	for (const param of parameters) {
		if ("$ref" in param) continue;

		if (param.in === "path") {
			pathParams.push(param);
		} else if (param.in === "query") {
			queryParams.push(param);
		}
	}

	return { pathParams, queryParams };
}

export function getBodyParams(
	schema: SchemaOrRef | undefined,
): ParameterObject[] {
	if (!schema || "$ref" in schema) {
		return [];
	}

	if (schema.type === "object" && schema.properties) {
		return Object.entries(schema.properties).map(([propName, propSchema]) => ({
			name: propName,
			in: "body",
			required: schema.required?.includes(propName) ?? false,
			schema: propSchema,
			description: propSchema.description,
		}));
	}
	return [];
}

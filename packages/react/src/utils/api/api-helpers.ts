import type {
	OpenApiDocument,
	ParameterObject,
	ParameterOrRef,
	SchemaOrRef,
} from "@/types/api/openapi";
import {
	normalizeBodyParams,
	normalizeParameter,
} from "./normalize-parameters";

export function classifyParameters(
	parameters: ParameterOrRef[],
	spec: OpenApiDocument,
) {
	const pathParams: ParameterObject[] = [];
	const queryParams: ParameterObject[] = [];

	for (const param of parameters) {
		if ("$ref" in param) continue;

		// Normalize the parameter to resolve refs and infer types
		const normalizedParam = normalizeParameter(param, spec);

		if (normalizedParam.in === "path") {
			pathParams.push(normalizedParam);
		} else if (normalizedParam.in === "query") {
			queryParams.push(normalizedParam);
		}
	}

	return { pathParams, queryParams };
}

/**
 * @deprecated Use normalizeBodyParams instead
 * This function is kept for backward compatibility but delegates to the new implementation
 */
export function getBodyParams(
	schema: SchemaOrRef | undefined,
	spec: OpenApiDocument,
): ParameterObject[] {
	return normalizeBodyParams(schema, spec);
}

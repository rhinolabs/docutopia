import { useMemo } from "react";
import type { ParameterObject } from "@/core/types";

interface EndpointParametersData {
	pathParams: ParameterObject[];
	queryParams: ParameterObject[];
	bodyParams: ParameterObject[];
	hasParameters: boolean;
}

export const useEndpointParameter = (
	parameters: { pathParams: ParameterObject[]; queryParams: ParameterObject[] },
	bodyParams: ParameterObject[],
): EndpointParametersData => {
	return useMemo(() => {
		const { pathParams, queryParams } = parameters;
		const hasParameters =
			pathParams.length > 0 || queryParams.length > 0 || bodyParams.length > 0;

		return {
			pathParams,
			queryParams,
			bodyParams,
			hasParameters,
		};
	}, [parameters, bodyParams]);
};

import { useMemo } from "react";
import { useOpenApiStore } from "@/stores/openapi-store";
import { classifyParameters, getBodyParams } from "@/utils/api/api-helpers";

export const useEndpointData = (slug?: string) => {
	const { spec, isLoading, error, getOperationBySlug } = useOpenApiStore();

	return useMemo(() => {
		if (!spec || isLoading || !slug) {
			return {
				operation: null,
				parameters: { pathParams: [], queryParams: [] },
				bodyParams: [],
				isLoading,
				error,
			};
		}

		const operation = getOperationBySlug(slug);

		if (!operation) {
			return {
				operation: null,
				parameters: { pathParams: [], queryParams: [] },
				bodyParams: [],
				isLoading: false,
				error: "Operation not found",
			};
		}

		const parameters = classifyParameters(operation.parameters ?? []);
		const bodySchema =
			operation.requestBody?.content?.["application/json"]?.schema;
		const bodyParams = getBodyParams(bodySchema);

		return {
			operation,
			parameters,
			bodyParams,
			isLoading: false,
			error: null,
		};
	}, [spec, slug, isLoading, error, getOperationBySlug]);
};

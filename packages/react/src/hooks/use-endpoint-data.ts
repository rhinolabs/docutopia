import { useOpenAPI } from "@/contexts";
import { classifyParameters, getBodyParams } from "@/utils/api/api-helpers";
import { useMemo } from "react";

export const useEndpointData = (slug?: string) => {
	const { spec, getOperationBySlug } = useOpenAPI();

	return useMemo(() => {
		if (!slug) {
			return {
				operation: null,
				parameters: { pathParams: [], queryParams: [] },
				bodyParams: [],
				error: null,
				spec,
			};
		}

		const operation = getOperationBySlug(slug);

		if (!operation) {
			return {
				operation: null,
				parameters: { pathParams: [], queryParams: [] },
				bodyParams: [],
				error: "Operation not found",
				spec,
			};
		}

		const parameters = classifyParameters(operation.parameters ?? [], spec);
		const bodySchema =
			operation.requestBody?.content?.["application/json"]?.schema;
		const bodyParams = getBodyParams(bodySchema, spec);

		return {
			operation,
			parameters,
			bodyParams,
			error: null,
			spec,
		};
	}, [spec, slug, getOperationBySlug]);
};

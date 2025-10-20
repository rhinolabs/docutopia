import type { EnhancedOperation } from "@/core/types";
import { useOpenApiStore } from "@/stores/openapi-store";
import { getRequestTypeClass } from "@/utils/api/request-type";
import { useMemo } from "react";

interface EndpointHeaderData {
	title: string;
	method: string;
	methodClass: string;
	endpoint: string;
	fullUrl: string;
}

export const useEndpointHeader = (
	operation: EnhancedOperation,
): EndpointHeaderData => {
	const { spec } = useOpenApiStore();

	return useMemo(() => {
		const endpoint = operation.path;
		const baseUrl = spec?.servers?.[0]?.url || "";
		const fullUrl = `${baseUrl}${endpoint}`;
		const methodClass = getRequestTypeClass(operation.method.toLowerCase());

		return {
			title: operation.summary || "API Operation",
			method: operation.method,
			methodClass,
			endpoint,
			fullUrl,
		};
	}, [operation, spec]);
};

import { useMemo } from "react";
import type { EnhancedOperation, ResponseEntry } from "@/core/types";

interface EndpointResponsesData {
	responses: ResponseEntry[];
	hasResponses: boolean;
}

export const useEndpointResponses = (operation: EnhancedOperation): EndpointResponsesData => {
	return useMemo(() => {
		if (!operation.responses) {
			return {
				responses: [],
				hasResponses: false,
			};
		}

		const responses = Object.entries(operation.responses).map(
			([status, response]): ResponseEntry => ({
				status,
				description: response.description || "No description",
				content: response.content,
			})
		);

		return {
			responses,
			hasResponses: responses.length > 0,
		};
	}, [operation.responses]);
};
import { useState, useCallback } from "react";
import type { RequestState, RequestConfig } from "@/core/types";
import { ApiClient } from "@/services/api-client";

export const useApiRequest = () => {
	const [state, setState] = useState<RequestState>({
		isLoading: false,
		response: null,
		error: null,
	});

	const executeRequest = useCallback(async (config: RequestConfig) => {
		setState((prev) => ({ ...prev, isLoading: true, error: null }));

		try {
			const apiClient = new ApiClient();
			const response = await apiClient.request(config);
			setState({ isLoading: false, response, error: null });
		} catch (error) {
			setState({
				isLoading: false,
				response: null,
				error: error instanceof Error ? error.message : "Request failed",
			});
		}
	}, []);

	const clearResponse = useCallback(() => {
		setState({ isLoading: false, response: null, error: null });
	}, []);

	return { ...state, executeRequest, clearResponse };
};

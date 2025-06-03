import { useMemo } from "react";
import type {
	EnhancedOperation,
	AuthCredentials,
	RequestParameters,
} from "@/core/types";

export const useCurlGenerator = (
	operation: EnhancedOperation,
	credentials: AuthCredentials,
	parameters: RequestParameters = { path: {}, query: {} },
) => {
	return useMemo(() => {
		const baseUrl = "https://api.example.com";
		let url = `${baseUrl}${operation.path}`;

		for (const [key, value] of Object.entries(parameters.path)) {
			url = url.replace(`{${key}}`, encodeURIComponent(String(value)));
		}

		const queryParams = new URLSearchParams();
		for (const [key, value] of Object.entries(parameters.query)) {
			if (value !== undefined && value !== null) {
				queryParams.append(key, String(value));
			}
		}

		if (queryParams.toString()) {
			url += `?${queryParams.toString()}`;
		}

		const headers = ["accept: application/json"];

		switch (credentials.type) {
			case "apiKey":
				if (credentials.value) {
					headers.push(`X-API-Key: ${credentials.value}`);
				}
				break;
			case "bearer":
				if (credentials.value) {
					headers.push(`Authorization: Bearer ${credentials.value}`);
				}
				break;
			case "basic":
				if (credentials.value && credentials.username) {
					const encoded = btoa(`${credentials.username}:${credentials.value}`);
					headers.push(`Authorization: Basic ${encoded}`);
				}
				break;
		}

		let curl = `curl --request ${operation.method} \\\n  --url '${url}'`;

		for (const header of headers) {
			curl += ` \\\n  --header '${header}'`;
		}

		if (
			["POST", "PUT", "PATCH"].includes(operation.method) &&
			parameters.body
		) {
			curl += ` \\\n  --data '${JSON.stringify(parameters.body, null, 2)}'`;
		}

		return curl;
	}, [operation, credentials, parameters]);
};

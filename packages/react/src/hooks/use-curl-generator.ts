import type {
	AuthCredentials,
	EnhancedOperation,
	RequestParameters,
} from "@/core/types";
import { joinPaths } from "@/utils/url-helpers";
import { useMemo } from "react";

interface CurlOptions {
	baseUrl?: string;
	includeHeaders?: boolean;
	includeBody?: boolean;
	prettify?: boolean;
}

export const useCurlGenerator = (
	operation: EnhancedOperation,
	credentials: AuthCredentials,
	parameters: RequestParameters,
	options: CurlOptions = {},
) => {
	const {
		baseUrl = "https://api.example.com",
		includeHeaders = true,
		includeBody = true,
		prettify = true,
	} = options;

	return useMemo(() => {
		const parts: string[] = ["curl"];

		// Add request method
		if (operation.method.toUpperCase() !== "GET") {
			parts.push(`--request ${operation.method.toUpperCase()}`);
		}

		// Build URL with path parameters
		let url = joinPaths(baseUrl, operation.path);
		for (const [key, value] of Object.entries(parameters.path || {})) {
			url = url.replace(`{${key}}`, encodeURIComponent(String(value)));
		}

		// Add query parameters
		const queryParams = new URLSearchParams();
		for (const [key, value] of Object.entries(parameters.query || {})) {
			if (value !== undefined && value !== null && value !== "") {
				queryParams.append(key, String(value));
			}
		}

		// Add auth query parameters if applicable
		if (credentials.value && credentials.location === "query") {
			const authQuery = generateAuthQuery(credentials);
			for (const [key, value] of Object.entries(authQuery)) {
				queryParams.append(key, value);
			}
		}

		if (queryParams.toString()) {
			url += `?${queryParams.toString()}`;
		}

		// Add URL (escaped for shell)
		parts.push(`"${url}"`);

		if (includeHeaders) {
			// Add standard headers
			parts.push('--header "Accept: application/json"');
			parts.push('--header "Content-Type: application/json"');

			// Add authentication headers
			if (credentials.value) {
				const authHeaders = generateAuthHeaders(credentials);
				for (const [key, value] of Object.entries(authHeaders)) {
					parts.push(`--header "${key}: ${value}"`);
				}
			}
		}

		// Add request body if applicable
		if (
			includeBody &&
			parameters.body &&
			["POST", "PUT", "PATCH"].includes(operation.method.toUpperCase())
		) {
			const bodyString =
				typeof parameters.body === "string"
					? parameters.body
					: JSON.stringify(parameters.body, null, 2);
			parts.push(`--data '${bodyString}'`);
		}

		// Join parts
		return prettify ? parts.join(" \\\n  ") : parts.join(" ");
	}, [
		operation,
		credentials,
		parameters,
		baseUrl,
		includeHeaders,
		includeBody,
		prettify,
	]);
};

// Helper functions (extracted from the auth store logic)
function generateAuthHeaders(
	credentials: AuthCredentials,
): Record<string, string> {
	const headers: Record<string, string> = {};

	if (!credentials.value) return headers;

	switch (credentials.type) {
		case "apiKey":
			if (credentials.location === "header") {
				headers[credentials.keyName || "x-api-key"] = credentials.value;
			}
			break;

		case "bearer":
			headers.Authorization = `${credentials.prefix || "Bearer "}${credentials.value}`;
			break;

		case "basic":
			if (credentials.username) {
				const encoded = btoa(`${credentials.username}:${credentials.value}`);
				headers.Authorization = `Basic ${encoded}`;
			}
			break;

		case "cookie":
			if (credentials.location === "header") {
				headers.Cookie = `${credentials.keyName || "session_token"}=${credentials.value}`;
			}
			break;
	}

	return headers;
}

function generateAuthQuery(
	credentials: AuthCredentials,
): Record<string, string> {
	const query: Record<string, string> = {};

	if (!credentials.value || credentials.location !== "query") return query;

	if (credentials.type === "apiKey") {
		query[credentials.keyName || "api_key"] = credentials.value;
	}

	return query;
}

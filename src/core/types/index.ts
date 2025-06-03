// Re-export existing OpenAPI types
export * from "../../types/api/openapi";

// New centralized types for the application
export interface RequestState {
	isLoading: boolean;
	response: ApiResponse | null;
	error: string | null;
}

export interface ApiResponse<T = unknown> {
	status: number;
	headers: Record<string, string>;
	data: T;
}

export interface RequestConfig {
	method: string;
	path: string;
	headers?: Record<string, string>;
	body?: unknown;
	timeout?: number;
}

export interface AuthCredentials {
	type: "apiKey" | "bearer" | "basic";
	value: string;
	username?: string; // For basic auth
	keyName?: string; // For API key location (header, query)
}

export interface ParameterValue {
	name: string;
	value: unknown;
	required: boolean;
	type: string;
}

export interface RequestParameters {
	path: Record<string, unknown>;
	query: Record<string, unknown>;
	body?: unknown;
}
// Re-export error types and handlers
export * from "./errors";

// Re-export existing OpenAPI types
export * from "../../types/api/openapi";

// Explicit re-exports for commonly used types
export type { ParameterObject } from "../../types/api/openapi";

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
	query?: Record<string, string>;
	timeout?: number;
}

export interface AuthCredentials {
	type: "apiKey" | "bearer" | "basic" | "cookie" | "none";
	value: string;
	username?: string; // For basic auth
	keyName?: string; // For API key location (x-api-key, api-key, etc.)
	location?: "header" | "query" | "cookie"; // Where to send the credential
	prefix?: string; // e.g., "Bearer ", "Token ", etc.
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

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

export type OAuth2FlowType =
	| "implicit"
	| "password"
	| "clientCredentials"
	| "authorizationCode";

export interface OAuth2Config {
	flow: OAuth2FlowType;
	clientId: string;
	clientSecret?: string; // Only for clientCredentials and authorizationCode (confidential clients)
	authorizationUrl?: string;
	tokenUrl?: string;
	scopes: string[];
	refreshToken?: string;
	expiresAt?: number; // Unix timestamp when token expires
}

export interface OpenIdConnectConfig {
	discoveryUrl: string;
	clientId: string;
	scopes: string[];
}

export interface AuthCredentials {
	type: "apiKey" | "bearer" | "basic" | "oauth2" | "openIdConnect";
	value: string;
	username?: string; // For basic auth
	keyName?: string; // For API key location (x-api-key, api-key, etc.)
	location?: "header" | "query"; // Where to send the credential
	prefix?: string; // e.g., "Bearer ", "Token ", etc.
	// OAuth2 specific configuration
	oauth2?: OAuth2Config;
	// OpenID Connect specific configuration
	openIdConnect?: OpenIdConnectConfig;
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

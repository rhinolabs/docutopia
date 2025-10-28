import type {
	AuthCredentials,
	EnhancedOperation,
	OpenApiDocument,
	RequestParameters,
} from "@/core/types";

/**
 * OpenAPI Context State
 * Read-only context for the loaded OpenAPI specification
 */
export interface OpenAPIContextValue {
	/**
	 * The loaded OpenAPI specification
	 */
	spec: OpenApiDocument;
	/**
	 * Base URL for API requests
	 */
	baseUrl?: string;
	/**
	 * Find an operation by its slug
	 */
	getOperationBySlug: (slug: string) => EnhancedOperation | null;
}

/**
 * Request Parameters Context State
 * Manages parameters for the "Try It" feature
 */
export interface RequestParamsContextValue {
	/**
	 * Current request parameters
	 */
	params: RequestParameters;
	/**
	 * Update a path parameter
	 */
	updatePathParam: (name: string, value: unknown) => void;
	/**
	 * Update a query parameter
	 */
	updateQueryParam: (name: string, value: unknown) => void;
	/**
	 * Update a body parameter (supports nested paths)
	 */
	updateBodyParam: (path: (string | number)[], value: unknown) => void;
	/**
	 * Clear all parameters
	 */
	clearParams: () => void;
	/**
	 * Set all parameters at once
	 */
	setAllParams: (params: RequestParameters) => void;
}

/**
 * Auth Context State
 * Manages authentication credentials with optional persistence
 */
export interface AuthContextValue {
	/**
	 * Current authentication credentials
	 */
	credentials: AuthCredentials;
	/**
	 * Whether the user is authenticated
	 */
	isAuthenticated: boolean;
	/**
	 * Update credentials (partial update)
	 */
	updateCredentials: (credentials: Partial<AuthCredentials>) => void;
	/**
	 * Clear all credentials
	 */
	clearCredentials: () => void;
	/**
	 * Set authentication type
	 */
	setAuthType: (type: AuthCredentials["type"]) => void;
	/**
	 * Generate authentication headers for API requests
	 */
	generateAuthHeaders: () => Record<string, string>;
	/**
	 * Generate authentication query parameters for API requests
	 */
	generateAuthQuery: () => Record<string, string>;
}

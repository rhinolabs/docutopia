export interface DocutopiaNextOptions {
	/**
	 * URL to the OpenAPI specification (JSON or YAML)
	 * @example '/api/openapi.json'
	 * @example 'https://api.example.com/spec.json'
	 */
	specUrl: string;

	/**
	 * Title for the API documentation
	 * @default 'API Documentation'
	 */
	title?: string;

	/**
	 * Base URL for API requests
	 * This will be passed to the Docutopia component
	 * @default window.location.origin (inferred from browser)
	 */
	baseUrl?: string;

	/**
	 * Basename for React Router
	 * This is automatically inferred from the route path
	 * Only override if you need custom routing behavior
	 * @example '/docs'
	 */
	basename?: string;

	/**
	 * Transform the OpenAPI specification before displaying it
	 * Useful for filtering, modifying, or enhancing the spec
	 * @param spec The original OpenAPI specification
	 * @returns The transformed specification
	 */
	transformSpec?: (spec: unknown) => unknown;

	/**
	 * Enable static generation (force-static)
	 * When true, the route will be statically generated at build time
	 * @default false
	 */
	static?: boolean;
}

export interface HTMLGeneratorOptions {
	/**
	 * Inline CSS content
	 */
	css: string;

	/**
	 * URL to the OpenAPI specification
	 */
	specUrl: string;

	/**
	 * Basename for React Router
	 */
	basename: string;

	/**
	 * Base URL for API requests
	 */
	baseUrl?: string;

	/**
	 * Page title
	 */
	title?: string;
}

import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app";

export interface DocutopiaProps {
	/**
	 * URL to the OpenAPI specification (JSON or YAML)
	 */
	specUrl: string;
	/**
	 * Base URL for the API endpoints
	 */
	baseUrl: string;
	/**
	 * Additional CSS classes to apply to the root container
	 */
	className?: string;
	/**
	 * Custom router basename for nested routing (e.g., "/docs")
	 * Only used when no custom router wrapper is provided
	 */
	basename?: string;
	/**
	 * Custom router wrapper for framework integrations
	 * If provided, Docutopia won't wrap App with BrowserRouter
	 * This allows frameworks like Next.js to provide their own routing
	 */
	routerWrapper?: (children: ReactNode) => ReactNode;
}

/**
 * Docutopia - A modern, interactive API documentation component
 *
 * @example
 * ```tsx
 * // Standalone usage with BrowserRouter
 * <Docutopia
 *   specUrl="https://petstore3.swagger.io/api/v3/openapi.json"
 *   baseUrl="https://petstore3.swagger.io"
 * />
 *
 * // With basename for server integration (e.g., Fastify at /docs)
 * <Docutopia
 *   specUrl="/docs/json"
 *   baseUrl="http://localhost:3000"
 *   basename="/docs"
 * />
 *
 * // With custom router for Next.js or other frameworks
 * <Docutopia
 *   specUrl="/api/openapi.json"
 *   baseUrl="http://localhost:3000"
 *   routerWrapper={(children) => <NextRouter>{children}</NextRouter>}
 * />
 * ```
 */
export function Docutopia({
	specUrl,
	baseUrl,
	className,
	basename,
	routerWrapper,
}: DocutopiaProps) {
	const app = <App specUrl={specUrl} baseUrl={baseUrl} />;

	// If custom router wrapper provided, use it (for Next.js, etc.)
	if (routerWrapper) {
		return <div className={className}>{routerWrapper(app)}</div>;
	}

	// Default: use BrowserRouter with optional basename
	return (
		<div className={className}>
			<BrowserRouter basename={basename}>
				{app}
			</BrowserRouter>
		</div>
	);
}

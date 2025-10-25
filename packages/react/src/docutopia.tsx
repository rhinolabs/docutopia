import { BrowserRouter } from "react-router-dom";
import { App } from "./app";
import { ReactRouterAdapter } from "./routing/adapters/react-router";
import { RoutingProvider } from "./routing/context";
import type { RoutingAdapter } from "./routing/types";

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
	 * Only used with React Router adapter
	 */
	basename?: string;
	/**
	 * Routing adapter for framework integration
	 * Defaults to ReactRouterAdapter (with BrowserRouter)
	 *
	 * For Next.js, use NextJSAdapter from @docutopia/nextjs
	 */
	adapter?: RoutingAdapter;
}

/**
 * Docutopia - A modern, interactive API documentation component
 *
 * @example
 * ```tsx
 * // Standalone usage with React Router (default)
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
 * // With custom adapter for Next.js
 * import { NextJSAdapter } from '@docutopia/nextjs';
 *
 * <Docutopia
 *   specUrl="/api/openapi.json"
 *   baseUrl="http://localhost:3000"
 *   adapter={NextJSAdapter}
 * />
 * ```
 */
export function Docutopia({
	specUrl,
	baseUrl,
	className,
	basename,
	adapter = ReactRouterAdapter,
}: DocutopiaProps) {
	const app = (
		<RoutingProvider adapter={adapter}>
			<App specUrl={specUrl} baseUrl={baseUrl} />
		</RoutingProvider>
	);

	// For React Router, wrap with BrowserRouter
	// For Next.js or other file-based routers, render directly
	const isReactRouter = adapter === ReactRouterAdapter;

	if (isReactRouter) {
		return (
			<div className={className}>
				<BrowserRouter basename={basename}>{app}</BrowserRouter>
			</div>
		);
	}

	// For other adapters (Next.js), no router wrapper needed
	return <div className={className}>{app}</div>;
}

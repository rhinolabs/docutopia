"use client";

import { OpenApiService } from "@/services";
import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app";
import {
	AuthProvider,
	OpenAPIProvider,
	RequestParamsProvider,
	SidebarStateProvider,
} from "./contexts";
import type { OpenApiDocument } from "./core/types";
import { ReactRouterAdapter } from "./routing/adapters/react-router";
import { RoutingProvider } from "./routing/context";
import type { RoutingAdapter } from "./routing/types";

export interface DocutopiaProps {
	/**
	 * Pre-loaded OpenAPI specification (for SSR/server-side loading)
	 * If provided, specUrl is ignored
	 *
	 * @example
	 * ```tsx
	 * // In Next.js with server-side loading
	 * const spec = await fetch(specUrl).then(r => r.json());
	 * <Docutopia spec={spec} baseUrl="https://api.example.com" />
	 * ```
	 */
	spec?: OpenApiDocument;
	/**
	 * URL to the OpenAPI specification (JSON or YAML)
	 * Used for client-side loading if spec prop is not provided
	 *
	 * @example
	 * ```tsx
	 * <Docutopia
	 *   specUrl="https://petstore3.swagger.io/api/v3/openapi.json"
	 *   baseUrl="https://petstore3.swagger.io"
	 * />
	 * ```
	 */
	specUrl?: string;
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
	/**
	 * Current slug/path for marking the active menu item
	 * Used by Next.js adapter to sync sidebar state with URL
	 *
	 * @example
	 * ```tsx
	 * // Next.js extracts from params
	 * const currentSlug = params.slug?.[0];
	 * <Docutopia spec={spec} currentSlug={currentSlug} />
	 * ```
	 */
	currentSlug?: string;
}

/**
 * Internal component that handles spec loading
 */
function DocutopiaInner({
	spec: initialSpec,
	specUrl,
	baseUrl,
	className,
	basename,
	adapter = ReactRouterAdapter,
	currentSlug,
}: DocutopiaProps) {
	const [spec, setSpec] = useState<OpenApiDocument | null>(initialSpec || null);
	const [isLoading, setIsLoading] = useState(!initialSpec && !!specUrl);
	const [error, setError] = useState<string | null>(null);

	// Load spec from URL if not provided
	useEffect(() => {
		// Skip if spec is already provided or no specUrl
		if (initialSpec || !specUrl) return;

		const loadSpec = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const openApiService = new OpenApiService();
				const loadedSpec = await openApiService.loadSpec(specUrl);
				setSpec(loadedSpec);
			} catch (err) {
				console.error("Failed to load spec from", specUrl, err);
				setError(
					`Failed to load spec: ${err instanceof Error ? err.message : "Unknown error"}`,
				);
			} finally {
				setIsLoading(false);
			}
		};

		loadSpec();
	}, [initialSpec, specUrl]);

	// Show loading state
	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
					<p>Loading API Documentation...</p>
				</div>
			</div>
		);
	}

	// Show error state
	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center text-red-500">
					<p>Error loading API documentation:</p>
					<p className="text-sm mt-2">{error}</p>
				</div>
			</div>
		);
	}

	// Spec must be available at this point
	if (!spec) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center text-red-500">
					<p>No OpenAPI specification provided</p>
					<p className="text-sm mt-2">
						Please provide either a `spec` or `specUrl` prop
					</p>
				</div>
			</div>
		);
	}

	const app = (
		<OpenAPIProvider spec={spec} baseUrl={baseUrl} currentSlug={currentSlug}>
			<AuthProvider>
				<RequestParamsProvider>
					<SidebarStateProvider>
						<RoutingProvider adapter={adapter}>
							<App />
						</RoutingProvider>
					</SidebarStateProvider>
				</RequestParamsProvider>
			</AuthProvider>
		</OpenAPIProvider>
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

/**
 * Docutopia - A modern, interactive API documentation component
 *
 * @example
 * Server-side loading (recommended for Next.js):
 * ```tsx
 * // In Next.js 13+ with server components
 * const spec = await fetch(specUrl).then(r => r.json());
 * <Docutopia spec={spec} baseUrl="https://api.example.com" />
 * ```
 *
 * @example
 * Client-side loading (backward compatible):
 * ```tsx
 * <Docutopia
 *   specUrl="https://petstore3.swagger.io/api/v3/openapi.json"
 *   baseUrl="https://petstore3.swagger.io"
 * />
 * ```
 *
 * @example
 * With basename for server integration (e.g., Fastify at /docs):
 * ```tsx
 * <Docutopia
 *   specUrl="/docs/json"
 *   baseUrl="http://localhost:3000"
 *   basename="/docs"
 * />
 * ```
 */
export function Docutopia(props: DocutopiaProps) {
	return <DocutopiaInner {...props} />;
}

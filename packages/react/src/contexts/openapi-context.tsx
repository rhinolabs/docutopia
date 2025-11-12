"use client";

import type { EnhancedOperation, OpenApiDocument } from "@/core/types";
import { OpenApiService } from "@/services/openapi-service";
import { getAvailableAuthTypes } from "@/utils/map-security-schemes";
import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import type { OpenAPIContextValue } from "./types";

/**
 * Context for the OpenAPI specification
 */
const OpenAPIContext = createContext<OpenAPIContextValue | null>(null);

/**
 * Hook to access the OpenAPI context
 * Throws error if used outside of OpenAPIProvider
 */
export function useOpenAPI(): OpenAPIContextValue {
	const context = useContext(OpenAPIContext);

	if (!context) {
		throw new Error(
			"useOpenAPI must be used within an OpenAPIProvider. " +
				"Make sure your component is wrapped with <OpenAPIProvider>.",
		);
	}

	return context;
}

/**
 * Provider component for OpenAPI specification
 *
 * This is a read-only context that distributes the OpenAPI spec throughout the app.
 * The spec should be loaded before passing it to this provider.
 *
 * @example
 * ```tsx
 * // In Next.js with server-side loading
 * const spec = await loadOpenAPISpec(specUrl);
 * return (
 *   <OpenAPIProvider spec={spec} baseUrl="https://api.example.com">
 *     <App />
 *   </OpenAPIProvider>
 * );
 * ```
 */
export function OpenAPIProvider({
	spec,
	baseUrl,
	currentSlug,
	children,
}: {
	spec: OpenApiDocument;
	baseUrl?: string;
	currentSlug?: string;
	children: ReactNode;
}) {
	const value = useMemo<OpenAPIContextValue>(() => {
		const openApiService = new OpenApiService();
		const availableAuthTypes = getAvailableAuthTypes(spec);

		return {
			spec,
			baseUrl,
			currentSlug,
			availableAuthTypes,
			getOperationBySlug: (slug: string): EnhancedOperation | null => {
				const split = slug.split("_");
				const index = split[1] ? Number.parseInt(split[1], 10) : 0;
				return openApiService.findOperationBySlug(spec, split[0], index);
			},
		};
	}, [spec, baseUrl, currentSlug]);

	return (
		<OpenAPIContext.Provider value={value}>{children}</OpenAPIContext.Provider>
	);
}

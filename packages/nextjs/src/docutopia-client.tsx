"use client";

import type { OpenApiDocument } from "@docutopia/react";
import {
	AuthProvider,
	OpenAPIProvider,
	RequestParamsProvider,
	SidebarStateProvider,
	RoutingProvider,
} from "@docutopia/react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { createNextJSAdapter } from "./adapter";

// Dynamically import App with SSR disabled to avoid "window is not defined" errors
// from @rhinolabs/ui Sidebar component which uses useWindowSize hook
const App = dynamic(
	() => import("@docutopia/react").then((mod) => ({ default: mod.App })),
	{ ssr: false },
);

export interface DocutopiaClientProps {
	/**
	 * Pre-loaded OpenAPI specification
	 */
	spec: OpenApiDocument;
	/**
	 * Base URL for the API endpoints
	 */
	baseUrl: string;
	/**
	 * Additional CSS classes to apply to the root container
	 */
	className?: string;
	/**
	 * Base path for documentation routing (optional)
	 */
	basePath?: string;
}

/**
 * Client-side wrapper for Docutopia in Next.js
 *
 * This component:
 * - Detects the current slug from Next.js params
 * - Configures the Next.js routing adapter
 * - Passes the current slug to track active menu items
 */
export function DocutopiaClient({
	spec,
	baseUrl,
	className,
	basePath,
}: DocutopiaClientProps) {
	const params = useParams();

	// Extract current slug from Next.js catch-all params
	// params.slug can be string[] for catch-all routes like [[...slug]]
	const currentSlug = useMemo(() => {
		if (!params?.slug) return undefined;
		// If it's an array (catch-all route), get the first segment
		return Array.isArray(params.slug) ? params.slug[0] : params.slug;
	}, [params]);

	// Create adapter with base path configuration
	const adapter = useMemo(() => createNextJSAdapter({ basePath }), [basePath]);

	return (
		<div className={className}>
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
		</div>
	);
}

"use client";

import type { RoutingAdapter } from "@docutopia/react";
import NextLink from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useMemo } from "react";

/**
 * Options for creating the Next.js adapter
 */
export interface NextJSAdapterOptions {
	/**
	 * Base path for the documentation
	 * If not provided, it will be auto-detected from the current pathname
	 *
	 * @example "/docs" for routes like /docs/endpoint-slug
	 */
	basePath?: string;
}

/**
 * Extracts the base path from a pathname
 * For example: "/docs/some-endpoint" → "/docs"
 *              "/api/v1/docs/endpoint" → "/api/v1/docs"
 *              "/endpoint" → ""
 */
function extractBasePath(pathname: string, slug?: string | string[]): string {
	if (!pathname || pathname === "/") return "";

	// Remove the slug portion from the pathname to get the base
	const slugStr = Array.isArray(slug) ? slug.join("/") : slug || "";
	if (slugStr && pathname.endsWith(`/${slugStr}`)) {
		return pathname.slice(0, -slugStr.length - 1);
	}

	// If no slug, check if pathname has multiple segments
	const segments = pathname.split("/").filter(Boolean);
	if (segments.length > 1) {
		// Return everything except the last segment
		return `/${segments.slice(0, -1).join("/")}`;
	}

	// Fallback: return the first segment
	return segments.length > 0 ? `/${segments[0]}` : "";
}

/**
 * Creates a Next.js App Router adapter for Docutopia
 *
 * This adapter integrates Docutopia with Next.js App Router (13+).
 * It uses file-based routing and automatically detects the base path.
 *
 * @example
 * File structure:
 * ```
 * app/docs/[[...slug]]/page.tsx
 * ```
 *
 * Usage in page:
 * ```tsx
 * import { Docutopia } from '@docutopia/nextjs';
 *
 * export default function DocsPage() {
 *   return (
 *     <Docutopia
 *       specUrl="/api/openapi.json"
 *       baseUrl="http://localhost:3000"
 *     />
 *   );
 * }
 * ```
 *
 * With custom base path:
 * ```tsx
 * <Docutopia
 *   specUrl="/api/openapi.json"
 *   baseUrl="http://localhost:3000"
 *   basePath="/custom/docs"
 * />
 * ```
 */
export function createNextJSAdapter(
	options: NextJSAdapterOptions = {},
): RoutingAdapter {
	return {
		useRouteParams: () => {
			const params = useParams();
			// Support both [[...slug]] and [apiUrl] dynamic routes
			// [[...slug]] returns array, [apiUrl] returns string
			const slugParam = params.slug;
			const apiUrl = Array.isArray(slugParam) ? slugParam[0] : params.apiUrl;

			return { apiUrl: apiUrl as string | undefined };
		},

		usePathname: () => {
			return usePathname();
		},

		Link: ({ to, children, className, title, onClick }) => {
			const pathname = usePathname();
			const params = useParams();

			// Determine base path: use provided option or auto-detect
			const basePath = useMemo(() => {
				if (options.basePath !== undefined) {
					return options.basePath;
				}

				// Auto-detect from pathname
				return extractBasePath(pathname, params.slug as string | string[]);
			}, [pathname, params.slug, options]);

			// Construct the full href with base path
			const href = basePath ? `${basePath}${to}` : to;

			return (
				<NextLink
					href={href}
					className={className}
					title={title}
					onClick={onClick}
				>
					{children}
				</NextLink>
			);
		},

		// Next.js uses file-based routing, so we don't need Routes/Route components
		Routes: undefined,
		Route: undefined,

		basePath: options.basePath,
	};
}

/**
 * Default Next.js adapter with auto-detection enabled
 *
 * @deprecated Use createNextJSAdapter() instead for better control
 */
export const NextJSAdapter: RoutingAdapter = createNextJSAdapter();

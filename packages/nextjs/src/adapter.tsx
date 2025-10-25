"use client";

import type { RoutingAdapter } from "@docutopia/react";
import NextLink from "next/link";
import { useParams } from "next/navigation";

/**
 * Next.js App Router adapter for Docutopia
 *
 * This adapter integrates Docutopia with Next.js App Router (13+).
 * It uses file-based routing instead of programmatic routes.
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
 */
export const NextJSAdapter: RoutingAdapter = {
	useRouteParams: () => {
		const params = useParams();
		// Support both [[...slug]] and [apiUrl] dynamic routes
		// [[...slug]] returns array, [apiUrl] returns string
		const slugParam = params.slug;
		const apiUrl = Array.isArray(slugParam) ? slugParam[0] : params.apiUrl;

		return { apiUrl: apiUrl as string | undefined };
	},

	Link: ({ to, children, className, title, onClick }) => (
		<NextLink href={to} className={className} title={title} onClick={onClick}>
			{children}
		</NextLink>
	),

	// Next.js uses file-based routing, so we don't need Routes/Route components
	Routes: undefined,
	Route: undefined,
};

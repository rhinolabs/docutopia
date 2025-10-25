"use client";

import { Docutopia as DocutopiaCore } from "@docutopia/react";
import { useMemo } from "react";
import { createNextJSAdapter } from "./adapter";

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
	 * Base path for documentation routing (optional)
	 *
	 * If not provided, the base path will be auto-detected from the current URL.
	 * For example, if your docs are at `/docs/[[...slug]]`, it will automatically
	 * use `/docs` as the base path.
	 *
	 * Only specify this if you need to override the auto-detection.
	 *
	 * @example "/docs" for routes like /docs/endpoint-slug
	 * @example "/api/v1/docs" for nested routes
	 */
	basePath?: string;
}

/**
 * Docutopia component for Next.js App Router
 *
 * This is a wrapper around the core Docutopia component that automatically
 * configures the Next.js routing adapter with base path detection.
 *
 * @example
 * Basic usage with auto-detection:
 * ```tsx
 * // File: app/docs/[[...slug]]/page.tsx
 * import { Docutopia } from '@docutopia/nextjs';
 * import '@docutopia/nextjs/styles';
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
 * @example
 * With custom base path:
 * ```tsx
 * // File: app/api/v1/docs/[[...slug]]/page.tsx
 * export default function DocsPage() {
 *   return (
 *     <Docutopia
 *       specUrl="/api/openapi.json"
 *       baseUrl="http://localhost:3000"
 *       basePath="/api/v1/docs"
 *     />
 *   );
 * }
 * ```
 */
export function Docutopia({
	specUrl,
	baseUrl,
	className,
	basePath,
}: DocutopiaProps) {
	// Create adapter with base path configuration
	const adapter = useMemo(() => createNextJSAdapter({ basePath }), [basePath]);

	return (
		<DocutopiaCore
			specUrl={specUrl}
			baseUrl={baseUrl}
			className={className}
			adapter={adapter}
		/>
	);
}

"use client";

import type { OpenApiDocument } from "@docutopia/react";
import { Docutopia as DocutopiaCore } from "@docutopia/react";
import { useMemo } from "react";
import { createNextJSAdapter } from "./adapter";

export interface DocutopiaProps {
	/**
	 * Pre-loaded OpenAPI specification (for SSR/server-side loading)
	 * If provided, specUrl is ignored
	 *
	 * @example
	 * ```tsx
	 * // Server Component (app/docs/[[...slug]]/page.tsx)
	 * import { Docutopia } from '@docutopia/nextjs';
	 *
	 * async function DocsPage() {
	 *   const spec = await fetch('https://api.example.com/openapi.json').then(r => r.json());
	 *   return <Docutopia spec={spec} baseUrl="https://api.example.com" />;
	 * }
	 * ```
	 */
	spec?: OpenApiDocument;
	/**
	 * URL to the OpenAPI specification (JSON or YAML)
	 * Used for client-side loading if spec prop is not provided
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
 * Server-side spec loading (recommended):
 * ```tsx
 * // File: app/docs/[[...slug]]/page.tsx (Server Component)
 * import { Docutopia } from '@docutopia/nextjs';
 * import '@docutopia/nextjs/styles';
 *
 * export default async function DocsPage() {
 *   const spec = await fetch('https://api.example.com/openapi.json').then(r => r.json());
 *   return (
 *     <Docutopia
 *       spec={spec}
 *       baseUrl="https://api.example.com"
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * Client-side spec loading (legacy):
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
 * export default async function DocsPage() {
 *   const spec = await fetch('/api/openapi.json').then(r => r.json());
 *   return (
 *     <Docutopia
 *       spec={spec}
 *       baseUrl="http://localhost:3000"
 *       basePath="/api/v1/docs"
 *     />
 *   );
 * }
 * ```
 */
export function Docutopia({
	spec,
	specUrl,
	baseUrl,
	className,
	basePath,
}: DocutopiaProps) {
	// Create adapter with base path configuration
	const adapter = useMemo(() => createNextJSAdapter({ basePath }), [basePath]);

	return (
		<DocutopiaCore
			spec={spec}
			specUrl={specUrl}
			baseUrl={baseUrl}
			className={className}
			adapter={adapter}
		/>
	);
}

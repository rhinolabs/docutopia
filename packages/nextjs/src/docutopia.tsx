import type { OpenApiDocument } from "@docutopia/react";
import { DocutopiaClient } from "./docutopia-client";

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
 * This is a Server Component that automatically fetches the OpenAPI spec
 * and passes it to the client component with route detection.
 *
 * @example
 * Using specUrl (auto-fetches server-side):
 * ```tsx
 * // File: app/docs/[[...slug]]/page.tsx
 * import { Docutopia } from '@docutopia/nextjs';
 * import '@docutopia/react/styles';
 *
 * export default function DocsPage() {
 *   return (
 *     <Docutopia
 *       specUrl="https://api.example.com/openapi.json"
 *       baseUrl="https://api.example.com"
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * Using pre-loaded spec:
 * ```tsx
 * // File: app/docs/[[...slug]]/page.tsx
 * import { Docutopia } from '@docutopia/nextjs';
 * import '@docutopia/react/styles';
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
export async function Docutopia({
	spec: providedSpec,
	specUrl,
	baseUrl,
	className,
	basePath,
}: DocutopiaProps) {
	let spec = providedSpec;

	// If spec not provided but specUrl is, fetch it server-side
	if (!spec && specUrl) {
		try {
			const response = await fetch(specUrl, {
				// Next.js-specific cache option
				// @ts-expect-error - Next.js extends fetch with `next` option
				next: { revalidate: 3600 }, // Cache for 1 hour
			});

			if (!response.ok) {
				throw new Error(
					`Failed to fetch OpenAPI spec: ${response.status} ${response.statusText}`,
				);
			}

			spec = await response.json();
		} catch (error) {
			console.error("Error fetching OpenAPI spec:", error);
			throw error;
		}
	}

	// Spec must be available at this point
	if (!spec) {
		throw new Error(
			"No OpenAPI specification provided. Please provide either 'spec' or 'specUrl' prop.",
		);
	}

	return (
		<DocutopiaClient
			spec={spec}
			baseUrl={baseUrl}
			className={className}
			basePath={basePath}
		/>
	);
}

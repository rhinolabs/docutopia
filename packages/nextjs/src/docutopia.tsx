"use client";

import { Docutopia as DocutopiaCore } from "@docutopia/react";
import { NextJSAdapter } from "./adapter";

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
}

/**
 * Docutopia component for Next.js App Router
 *
 * This is a wrapper around the core Docutopia component that automatically
 * configures the Next.js routing adapter.
 *
 * @example
 * File structure:
 * ```
 * app/docs/[[...slug]]/page.tsx
 * ```
 *
 * Usage:
 * ```tsx
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
 */
export function Docutopia({ specUrl, baseUrl, className }: DocutopiaProps) {
	return (
		<DocutopiaCore
			specUrl={specUrl}
			baseUrl={baseUrl}
			className={className}
			adapter={NextJSAdapter}
		/>
	);
}

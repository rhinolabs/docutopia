/**
 * @docutopia/nextjs
 *
 * Next.js adapter for Docutopia - A modern, interactive API documentation library
 *
 * This package provides everything you need to integrate Docutopia with Next.js App Router.
 * It re-exports all of @docutopia/react plus Next.js-specific integrations.
 *
 * @example
 * Basic usage with auto-detection:
 * ```tsx
 * // app/docs/[[...slug]]/page.tsx
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
 * // app/api/v1/docs/[[...slug]]/page.tsx
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

// Re-export everything from @docutopia/react
export * from "@docutopia/react";

// Override Docutopia component with Next.js version
export { Docutopia } from "./docutopia";
export type { DocutopiaProps } from "./docutopia";

// Export Next.js adapter (for advanced use cases)
export { NextJSAdapter, createNextJSAdapter } from "./adapter";
export type { NextJSAdapterOptions } from "./adapter";

import { createRoot } from "react-dom/client";
import { Docutopia, type DocutopiaProps } from "./docutopia";
import "./index.css";

/**
 * Options for initializing Docutopia in the browser
 */
export interface DocutopiaBrowserOptions extends DocutopiaProps {
	/**
	 * Custom router basename for nested routing
	 * Automatically configured when integrated with frameworks like Fastify
	 * @example "/docs" for Fastify mounted at /docs
	 */
	basename?: string;
}

/**
 * Initialize Docutopia in the browser
 * This is the entry point for the UMD bundle used by server integrations
 *
 * @param elementId - ID of the DOM element to mount Docutopia
 * @param props - Configuration options including specUrl, baseUrl, and optional basename
 * @returns Object with unmount function to clean up the React root
 *
 * @example
 * ```js
 * // Standalone usage
 * window.Docutopia.init('root', {
 *   specUrl: 'https://api.example.com/openapi.json',
 *   baseUrl: 'https://api.example.com'
 * });
 *
 * // With basename for server integration (e.g., Fastify at /docs)
 * window.Docutopia.init('root', {
 *   specUrl: '/docs/json',
 *   baseUrl: window.location.origin,
 *   basename: '/docs'
 * });
 * ```
 */
export function init(
	elementId: string,
	props: DocutopiaBrowserOptions,
): { unmount: () => void } {
	const element = document.getElementById(elementId);
	if (!element) {
		throw new Error(`Element with id "${elementId}" not found`);
	}

	const root = createRoot(element);
	root.render(<Docutopia {...props} />);

	return {
		unmount: () => root.unmount(),
	};
}

// Also export the component for advanced usage
export { Docutopia } from "./docutopia";
export type { DocutopiaProps } from "./docutopia";

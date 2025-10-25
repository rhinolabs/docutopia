import type { ComponentType, ReactNode } from "react";

/**
 * Props for the Link component in routing adapters
 */
export interface LinkProps {
	/**
	 * The destination path/URL
	 */
	to: string;
	/**
	 * Child elements to render inside the link
	 */
	children: ReactNode;
	/**
	 * Additional CSS classes
	 */
	className?: string;
	/**
	 * Optional title attribute
	 */
	title?: string;
	/**
	 * Click handler
	 */
	onClick?: () => void;
}

/**
 * Props for the Route component (used by React Router adapter)
 */
export interface RouteProps {
	/**
	 * Path pattern for the route
	 */
	path?: string;
	/**
	 * Whether this is an index route
	 */
	index?: boolean;
	/**
	 * Element to render when route matches
	 */
	element: ReactNode;
}

/**
 * Routing adapter interface for framework integration
 *
 * This abstraction allows Docutopia to work with different routing solutions:
 * - React Router (SPA)
 * - Next.js App Router (SSR/File-based)
 * - Remix
 * - Custom routing solutions
 */
export interface RoutingAdapter {
	/**
	 * Hook to get route parameters
	 * Must return an object with optional apiUrl parameter
	 */
	useRouteParams: () => { apiUrl?: string };

	/**
	 * Link component for navigation
	 * Must accept to, children, className, title, and onClick props
	 */
	Link: ComponentType<LinkProps>;

	/**
	 * Routes container component (optional - only for SPA routers like React Router)
	 * For file-based routing (Next.js), this should be undefined
	 */
	Routes?: ComponentType<{ children: ReactNode }>;

	/**
	 * Route component (optional - only for SPA routers like React Router)
	 * For file-based routing (Next.js), this should be undefined
	 */
	Route?: ComponentType<RouteProps>;

	/**
	 * Base path for routing (optional)
	 * Used to prefix all links when docs are mounted at a subdirectory
	 * Example: "/docs" for routes like /docs/endpoint-slug
	 */
	basePath?: string;
}

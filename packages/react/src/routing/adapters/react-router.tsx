import {
	Link as RRLink,
	Route as RRRoute,
	Routes as RRRoutes,
	useParams,
} from "react-router-dom";
import type { RoutingAdapter } from "../types";

/**
 * React Router adapter for Docutopia
 *
 * This adapter integrates Docutopia with React Router for traditional SPA routing.
 *
 * @example
 * ```tsx
 * import { BrowserRouter } from 'react-router-dom';
 * import { Docutopia, ReactRouterAdapter } from '@docutopia/react';
 *
 * <BrowserRouter>
 *   <Docutopia
 *     adapter={ReactRouterAdapter}
 *     specUrl="..."
 *     baseUrl="..."
 *   />
 * </BrowserRouter>
 * ```
 */
export const ReactRouterAdapter: RoutingAdapter = {
	useRouteParams: () => {
		const { apiUrl } = useParams<{ apiUrl: string }>();
		return { apiUrl };
	},

	Link: ({ to, children, className, title, onClick }) => (
		<RRLink to={to} className={className} title={title} onClick={onClick}>
			{children}
		</RRLink>
	),

	Routes: RRRoutes,

	Route: RRRoute,
};

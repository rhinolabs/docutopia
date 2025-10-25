import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { RoutingAdapter } from "./types";

/**
 * Context for providing routing adapter throughout the component tree
 */
const RoutingContext = createContext<RoutingAdapter | null>(null);

/**
 * Hook to access the routing adapter
 * Throws error if used outside of RoutingProvider
 */
export function useRouting(): RoutingAdapter {
	const context = useContext(RoutingContext);

	if (!context) {
		throw new Error(
			"useRouting must be used within a RoutingProvider. " +
				"Make sure your Docutopia component has a valid routing adapter configured.",
		);
	}

	return context;
}

/**
 * Provider component for routing adapter
 */
export function RoutingProvider({
	adapter,
	children,
}: {
	adapter: RoutingAdapter;
	children: ReactNode;
}) {
	return (
		<RoutingContext.Provider value={adapter}>
			{children}
		</RoutingContext.Provider>
	);
}

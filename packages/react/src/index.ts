// Main component export
export { Docutopia } from "./docutopia";
export type { DocutopiaProps } from "./docutopia";

// Context exports
export {
	OpenAPIProvider,
	useOpenAPI,
} from "./contexts/openapi-context";
export {
	RequestParamsProvider,
	useRequestParams,
} from "./contexts/request-params-context";
export { AuthProvider, useAuth } from "./contexts/auth-context";

// Type exports
export type { OpenApiDocument } from "./core/types";
export type {
	OpenAPIContextValue,
	RequestParamsContextValue,
	AuthContextValue,
} from "./contexts/types";

// Routing adapter exports
export { ReactRouterAdapter } from "./routing/adapters/react-router";
export { useRouting, RoutingProvider } from "./routing/context";
export type { RoutingAdapter, LinkProps, RouteProps } from "./routing/types";

// Import styles - they will be bundled with the component
import "./index.css";

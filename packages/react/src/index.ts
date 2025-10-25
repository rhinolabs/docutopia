// Main component export
export { Docutopia } from "./docutopia";
export type { DocutopiaProps } from "./docutopia";

// Routing adapter exports
export { ReactRouterAdapter } from "./routing/adapters/react-router";
export { useRouting, RoutingProvider } from "./routing/context";
export type { RoutingAdapter, LinkProps, RouteProps } from "./routing/types";

// Import styles - they will be bundled with the component
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { App } from "./app";

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
	/**
	 * Custom router basename for nested routing
	 */
	basename?: string;
}

/**
 * Docutopia - A modern, interactive API documentation component
 *
 * @example
 * ```tsx
 * <Docutopia
 *   specUrl="https://petstore3.swagger.io/api/v3/openapi.json"
 *   baseUrl="https://petstore3.swagger.io"
 * />
 * ```
 */
export function Docutopia({
	specUrl,
	baseUrl,
	className,
	basename,
}: DocutopiaProps) {
	return (
		<div className={className}>
			<BrowserRouter basename={basename}>
				<App specUrl={specUrl} baseUrl={baseUrl} />
			</BrowserRouter>
		</div>
	);
}

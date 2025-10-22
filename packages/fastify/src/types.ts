import type { SwaggerOptions } from "@fastify/swagger";
import type {
	FastifyPluginCallback,
	FastifyReply,
	FastifyRequest,
} from "fastify";

export interface DocutopiaFastifyOptions {
	/**
	 * URL prefix for the documentation routes
	 * @default "/documentation"
	 */
	routePrefix?: string;

	/**
	 * URL to the OpenAPI specification (JSON or YAML)
	 * If not provided, defaults to `{routePrefix}/json`
	 * @example "/docs/json" - Use auto-generated endpoint
	 * @example "/api/openapi.json" - Custom endpoint
	 * @example "https://api.example.com/spec.json" - External spec
	 */
	specUrl?: string;

	/**
	 * Configuration for @fastify/swagger
	 * If @fastify/swagger is not already registered, it will be registered automatically with this configuration
	 *
	 * Note: Docutopia routes (/, /*, /json) use `hide: true` in their schema and are always excluded from the spec
	 */
	swagger?: SwaggerOptions;

	/**
	 * Function to transform the swagger specification dynamically per request
	 */
	transformSpecification?: (
		swaggerObject: unknown,
		request: FastifyRequest,
		reply: FastifyReply,
	) => unknown;

	/**
	 * Clone the swagger object before transforming it
	 * @default true
	 */
	transformSpecificationClone?: boolean;
}

export type DocutopiaFastifyPlugin =
	FastifyPluginCallback<DocutopiaFastifyOptions>;

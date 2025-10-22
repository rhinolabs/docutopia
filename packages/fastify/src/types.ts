import type { FastifyPluginCallback, FastifyRequest, FastifyReply } from "fastify";

export interface DocutopiaFastifyOptions {
	/**
	 * URL prefix for the documentation routes
	 * @default "/documentation"
	 */
	routePrefix?: string;

	/**
	 * URL to the OpenAPI specification (JSON or YAML)
	 * @example "/docs/json" - Use Fastify's swagger endpoint
	 * @example "/api/openapi.json" - Custom endpoint
	 * @example "https://api.example.com/spec.json" - External spec
	 */
	specUrl: string;

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

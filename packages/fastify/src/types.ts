import type { FastifyPluginCallback, FastifyRequest, FastifyReply } from "fastify";

export interface DocutopiaFastifyOptions {
	/**
	 * URL prefix for the documentation routes
	 * @default "/documentation"
	 */
	routePrefix?: string;

	/**
	 * UI configuration options
	 */
	uiConfig?: Record<string, unknown>;

	/**
	 * Route hooks
	 */
	uiHooks?: {
		onRequest?: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
		preHandler?: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
	};

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

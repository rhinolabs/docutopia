import swagger from "@fastify/swagger";
import fp from "fastify-plugin";
import { routes } from "../lib/routes";
import type { DocutopiaFastifyPlugin } from "./types";

const docutopiaPlugin: DocutopiaFastifyPlugin = async (fastify, options) => {
	const routePrefix = options.routePrefix || "/documentation";
	const specUrl = options.specUrl || `${routePrefix}/json`;

	// Register @fastify/swagger if not already registered
	if (!fastify.hasPlugin("@fastify/swagger")) {
		const swaggerOptions = options.swagger || {
			openapi: {
				info: {
					title: "API Documentation",
					description: "API documentation powered by Docutopia",
					version: "1.0.0",
				},
			},
		};

		await fastify.register(swagger, swaggerOptions);
	}

	await fastify.register(routes, {
		...options,
		prefix: routePrefix,
		specUrl,
	});
};

export default fp(docutopiaPlugin, {
	fastify: "5.x",
	name: "@docutopia/fastify",
});

export type { DocutopiaFastifyOptions } from "./types";

import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import type { DocutopiaFastifyPlugin } from "./types";
import { routes } from "../lib/routes";

const docutopiaPlugin: DocutopiaFastifyPlugin = async (fastify, options) => {
	const routePrefix = options.routePrefix || "/documentation";
	const specUrl = options.specUrl || `${routePrefix}/json`;

	// Register @fastify/swagger if not already registered
	if (!fastify.hasPlugin("@fastify/swagger")) {
		// biome-ignore lint/suspicious/noExplicitAny: Swagger options
		const swaggerOptions: any = options.swagger || {
			openapi: {
				info: {
					title: "API Documentation",
					description: "API documentation powered by Docutopia",
					version: "1.0.0",
				},
			},
		};

		// Get user's hiddenTag (can be string or array) and user's transform
		const userHiddenTag = swaggerOptions.hiddenTag;
		const userTransform = swaggerOptions.transform;

		// Build a list of hidden tags (always include "docutopia")
		const hiddenTags = ["docutopia"];
		if (userHiddenTag) {
			// Support both string and array
			if (Array.isArray(userHiddenTag)) {
				hiddenTags.push(...userHiddenTag);
			} else {
				hiddenTags.push(userHiddenTag);
			}
		}

		await fastify.register(swagger, {
			...swaggerOptions,
			// Use transform to hide routes with any of the hidden tags
			transform: ({ schema, url }) => {
				// Hide routes that have any of the hidden tags
				if (schema?.tags?.some((tag: string) => hiddenTags.includes(tag))) {
					return { schema: { ...schema, hide: true }, url };
				}
				// Apply user's transform if provided
				if (userTransform) {
					return userTransform({ schema, url });
				}
				return { schema, url };
			},
		});
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

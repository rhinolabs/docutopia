import fp from "fastify-plugin";
import type { DocutopiaFastifyOptions, DocutopiaFastifyPlugin } from "./types";
import { routes } from "../lib/routes";

const docutopiaPlugin: DocutopiaFastifyPlugin = async (fastify, options) => {
	await fastify.register(routes, {
		...options,
		prefix: options.routePrefix || "/documentation",
		specUrl: options.specUrl,
	});
};

export default fp(docutopiaPlugin, {
	fastify: "5.x",
	name: "@docutopia/fastify",
	dependencies: ["@fastify/swagger"],
});

export type { DocutopiaFastifyOptions } from "./types";

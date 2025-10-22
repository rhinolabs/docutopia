import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import yaml from "yaml";

interface RoutesOptions {
	prefix: string;
	uiConfig?: Record<string, unknown>;
	hooks?: {
		onRequest?: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
		preHandler?: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
	};
	transformSpecification?: (
		swaggerObject: unknown,
		request: FastifyRequest,
		reply: FastifyReply,
	) => unknown;
	transformSpecificationClone?: boolean;
}

export async function routes(
	fastify: FastifyInstance,
	opts: RoutesOptions,
): Promise<void> {
	const hooks = Object.create(null);
	if (opts.hooks) {
		const additionalHooks = ["onRequest", "preHandler"] as const;
		for (const hook of additionalHooks) {
			if (opts.hooks[hook]) {
				hooks[hook] = opts.hooks[hook];
			}
		}
	}

	// Read CSS and JS from @docutopia/react browser bundle
	const cssPath = join(__dirname, "../../react/dist/browser/index.css");
	const jsPath = join(__dirname, "../../react/dist/browser/index.js");

	let css = "";
	let js = "";

	try {
		css = readFileSync(cssPath, "utf-8");
	} catch (error) {
		fastify.log.warn(
			`Could not read Docutopia CSS file: ${(error as Error).message}`,
		);
	}

	try {
		js = readFileSync(jsPath, "utf-8");
	} catch (error) {
		fastify.log.warn(
			`Could not read Docutopia JS file: ${(error as Error).message}`,
		);
	}

	// Serve main documentation UI
	fastify.route({
		url: "/",
		method: "GET",
		schema: { hide: true },
		...hooks,
		handler: async (request, reply) => {
			const html = generateDocutopiaHTML({
				css,
				js,
				specUrl: `${opts.prefix}/json`,
			});

			reply.header("content-type", "text/html; charset=utf-8").send(html);
		},
	});

	// Serve OpenAPI spec as JSON
	const hasTransformSpecificationFn =
		typeof opts.transformSpecification === "function";
	const shouldCloneSwaggerObject = opts.transformSpecificationClone ?? true;

	fastify.route({
		url: "/json",
		method: "GET",
		schema: { hide: true },
		...hooks,
		handler: async (request, reply) => {
			if (typeof fastify.swagger !== "function") {
				return reply.code(404).send({
					error: "Not Found",
					message:
						"OpenAPI specification not available. Please register @fastify/swagger first.",
				});
			}

			let swaggerObject = fastify.swagger();

			if (hasTransformSpecificationFn) {
				if (shouldCloneSwaggerObject) {
					// Deep clone to avoid mutation
					swaggerObject = JSON.parse(JSON.stringify(swaggerObject));
				}
				swaggerObject = opts.transformSpecification!(
					swaggerObject,
					request,
					reply,
				);
			}

			reply.header("content-type", "application/json; charset=utf-8");
			return swaggerObject;
		},
	});

	// Serve OpenAPI spec as YAML
	fastify.route({
		url: "/yaml",
		method: "GET",
		schema: { hide: true },
		...hooks,
		handler: async (request, reply) => {
			if (typeof fastify.swagger !== "function") {
				return reply.code(404).send({
					error: "Not Found",
					message:
						"OpenAPI specification not available. Please register @fastify/swagger first.",
				});
			}

			let swaggerObject = fastify.swagger();

			if (hasTransformSpecificationFn) {
				if (shouldCloneSwaggerObject) {
					swaggerObject = JSON.parse(JSON.stringify(swaggerObject));
				}
				swaggerObject = opts.transformSpecification!(
					swaggerObject,
					request,
					reply,
				);
			}

			reply.header("content-type", "application/x-yaml; charset=utf-8");
			return yaml.stringify(swaggerObject);
		},
	});
}

function generateDocutopiaHTML(options: {
	css: string;
	js: string;
	specUrl: string;
}): string {
	const { css, js, specUrl } = options;

	return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>API Documentation - Docutopia</title>
	<style>${css}</style>
</head>
<body>
	<div id="root"></div>

	<script>
		// UMD bundle is loaded, Docutopia is available globally
		${js}
	</script>

	<script>
		// Initialize Docutopia
		if (window.Docutopia && window.Docutopia.Docutopia) {
			const React = window.React;
			const ReactDOM = window.ReactDOM;

			const config = {
				specUrl: ${JSON.stringify(specUrl)},
				baseUrl: window.location.origin
			};

			const root = ReactDOM.createRoot(document.getElementById('root'));
			root.render(React.createElement(window.Docutopia.Docutopia, config));
		} else {
			document.getElementById('root').innerHTML = \`
				<div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui;">
					<div style="text-align: center;">
						<h1 style="color: #dc2626;">Error Loading Docutopia</h1>
						<p>The Docutopia component could not be loaded.</p>
						<p style="color: #666; margin-top: 2rem;">
							You can still access the OpenAPI spec at:
							<a href="${specUrl}" style="color: #0066cc;">${specUrl}</a>
						</p>
					</div>
				</div>
			\`;
		}
	</script>
</body>
</html>`;
}

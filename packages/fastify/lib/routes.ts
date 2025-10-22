import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface RoutesOptions {
	prefix: string;
	specUrl: string;
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
	const htmlHandler = async (request: FastifyRequest, reply: FastifyReply) => {
		const html = generateDocutopiaHTML({
			css,
			js,
			specUrl: opts.specUrl,
			basename: opts.prefix,
		});

		reply.header("content-type", "text/html; charset=utf-8").send(html);
	};

	// Root route for documentation
	fastify.route({
		url: "/",
		method: "GET",
		schema: { hide: true },
		...hooks,
		handler: htmlHandler,
	});

	// Wildcard route to handle all sub-routes (for React Router)
	// This allows URLs like /docs/get-users to work with BrowserRouter
	fastify.route({
		url: "/*",
		method: "GET",
		schema: { hide: true },
		...hooks,
		handler: htmlHandler,
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
	basename: string;
}): string {
	const { css, js, specUrl, basename } = options;

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
		// Initialize Docutopia after DOM is ready
		document.addEventListener('DOMContentLoaded', () => {
			try {
				if (typeof window.Docutopia === 'object' && typeof window.Docutopia.init === 'function') {
					// Initialize Docutopia with the spec URL, base URL, and basename
					window.Docutopia.init('root', {
						specUrl: '${specUrl}',
						baseUrl: window.location.origin,
						basename: '${basename}'
					});
				} else {
					document.getElementById('root').innerHTML = \`
						<div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui;">
							<div style="text-align: center;">
								<h1 style="color: #dc2626;">Docutopia Not Found</h1>
								<p>The Docutopia bundle did not load correctly.</p>
								<p style="color: #666; margin-top: 2rem;">
									You can still access the OpenAPI spec at:
									<a href="${specUrl}" style="color: #0066cc;">${specUrl}</a>
								</p>
							</div>
						</div>
					\`;
				}
			} catch (error) {
				document.getElementById('root').innerHTML = \`
					<div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui;">
						<div style="text-align: center;">
							<h1 style="color: #dc2626;">Error Loading Docutopia</h1>
							<p>Failed to initialize: \${error.message}</p>
							<p style="color: #666; margin-top: 2rem;">
								You can still access the OpenAPI spec at:
								<a href="${specUrl}" style="color: #0066cc;">${specUrl}</a>
							</p>
						</div>
					</div>
				\`;
			}
		});
	</script>
</body>
</html>`;
}

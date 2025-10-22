import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

interface RoutesOptions {
	prefix: string;
	specUrl: string;
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
	// Read CSS and JS from @docutopia/react package using its exports
	let css = "";
	let js = "";

	try {
		// Use require.resolve with the package exports
		const cssPath = require.resolve("@docutopia/react/browser/styles");
		const jsPath = require.resolve("@docutopia/react/browser");

		css = readFileSync(cssPath, "utf-8");
		js = readFileSync(jsPath, "utf-8");
	} catch (error) {
		fastify.log.error(
			`Could not read Docutopia assets from @docutopia/react package: ${(error as Error).message}`,
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
		handler: htmlHandler,
	});

	// Wildcard route to handle all sub-routes (for React Router)
	// This allows URLs like /docs/get-users to work with BrowserRouter
	fastify.route({
		url: "/*",
		method: "GET",
		handler: htmlHandler,
	});

	// Serve OpenAPI spec as JSON
	const hasTransformSpecificationFn =
		typeof opts.transformSpecification === "function";
	const shouldCloneSwaggerObject = opts.transformSpecificationClone ?? true;

	fastify.route({
		url: "/json",
		method: "GET",
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

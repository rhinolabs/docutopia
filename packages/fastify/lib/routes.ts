import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

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
	let css = "";
	let js = "";

	try {
		const cssPath = require.resolve("@docutopia/react/styles");
		const rhinolabsUiCssPath = require.resolve("@rhinolabs/ui/dist/styles.css");
		const jsPath = require.resolve("@docutopia/react/browser");

		const docutopiaCss = readFileSync(cssPath, "utf-8");
		const rhinolabsUiCss = readFileSync(rhinolabsUiCssPath, "utf-8");

		// Combine both CSS files - @rhinolabs/ui first, then @docutopia/react
		css = `${rhinolabsUiCss}\n${docutopiaCss}`;
		js = readFileSync(jsPath, "utf-8");
	} catch (error) {
		fastify.log.error(
			`Could not read Docutopia assets from @docutopia/react package: ${(error as Error).message}`,
		);
	}

	fastify.route({
		url: "/docutopia.js",
		method: "GET",
		schema: {
			hide: true,
		},
		handler: async (request, reply) => {
			reply
				.header("content-type", "application/javascript; charset=utf-8")
				.header("cache-control", "public, max-age=31536000")
				.send(js);
		},
	});

	// Serve main documentation UI
	const htmlHandler = async (request: FastifyRequest, reply: FastifyReply) => {
		const html = generateDocutopiaHTML({
			css,
			specUrl: opts.specUrl,
			basename: opts.prefix,
		});

		reply.header("content-type", "text/html; charset=utf-8").send(html);
	};

	// Root route for documentation
	fastify.route({
		url: "/",
		method: "GET",
		schema: {
			hide: true,
		},
		handler: htmlHandler,
	});

	// Wildcard route to handle all sub-routes (for React Router)
	// This allows URLs like /docs/get-users to work with BrowserRouter
	fastify.route({
		url: "/*",
		method: "GET",
		schema: {
			hide: true,
		},
		handler: htmlHandler,
	});

	// Serve OpenAPI spec as JSON
	const hasTransformSpecificationFn =
		typeof opts.transformSpecification === "function";
	const shouldCloneSwaggerObject = opts.transformSpecificationClone ?? true;

	fastify.route({
		url: "/json",
		method: "GET",
		schema: {
			hide: true,
		},
		handler: async (request, reply) => {
			if (typeof fastify.swagger !== "function") {
				return reply.code(404).send({
					error: "Not Found",
					message:
						"OpenAPI specification not available. Please register @fastify/swagger first.",
				});
			}

			let swaggerObject: unknown = fastify.swagger();

			if (hasTransformSpecificationFn) {
				if (shouldCloneSwaggerObject) {
					// Deep clone to avoid mutation
					swaggerObject = JSON.parse(JSON.stringify(swaggerObject));
				}
				// biome-ignore lint/style/noNonNullAssertion:
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
	specUrl: string;
	basename: string;
}): string {
	const { css, specUrl, basename } = options;

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

	<!-- Initialize Docutopia -->
	<script type="module">
		import { Docutopia, renderDocutopia } from '${basename}/docutopia.js';

		try {
			const element = document.getElementById('root');
			if (!element) {
				throw new Error('Root element not found');
			}

			// If renderDocutopia function exists, use it
			if (typeof renderDocutopia === 'function') {
				renderDocutopia(element, {
					specUrl: '${specUrl}',
					baseUrl: window.location.origin,
					basename: '${basename}'
				});
			} else {
				// Fallback error
				throw new Error('renderDocutopia function not found');
			}
		} catch (error) {
			console.error('Docutopia initialization error:', error);
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
	</script>
</body>
</html>`;
}

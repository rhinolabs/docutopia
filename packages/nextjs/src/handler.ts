import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { generateDocutopiaHTML } from "./lib/html-generator";
import type { DocutopiaNextOptions } from "./types";

/**
 * Creates a Next.js App Router handler for Docutopia documentation
 *
 * @example
 * ```typescript
 * // app/docs/[[...slug]]/route.ts
 * import { createDocutopiaHandler } from '@docutopia/nextjs';
 *
 * export const { GET } = createDocutopiaHandler({
 *   specUrl: '/api/openapi.json',
 *   title: 'My API Documentation'
 * });
 * ```
 */
export function createDocutopiaHandler(options: DocutopiaNextOptions) {
	// Cache for assets - loaded on first request
	let assetsCache: { css: string; js: string } | null = null;

	/**
	 * Loads Docutopia assets from @docutopia/react package
	 * Cached after first load to avoid repeated file reads
	 */
	function loadAssets(): { css: string; js: string } {
		if (assetsCache) {
			return assetsCache;
		}

		let css = "";
		let js = "";

		try {
			// Manually construct paths to avoid Next.js build-time analysis
			// Get the current file location
			const __filename = fileURLToPath(import.meta.url);
			const __dirname = dirname(__filename);

			// Navigate from node_modules/@docutopia/nextjs/dist to node_modules/@docutopia/react/dist
			const reactDistPath = join(__dirname, "../../react/dist");
			const cssPath = join(reactDistPath, "index.css");
			const jsPath = join(reactDistPath, "index.js");

			css = readFileSync(cssPath, "utf-8");
			js = readFileSync(jsPath, "utf-8");
		} catch (error) {
			console.error(
				`[Docutopia] Could not read assets from @docutopia/react package: ${(error as Error).message}`,
			);
		}

		assetsCache = { css, js };
		return assetsCache;
	}

	/**
	 * GET handler for Next.js App Router
	 * Handles all routes under the catch-all [[...slug]] pattern
	 */
	const GET = async (
		request: NextRequest,
		context: { params: Promise<{ slug?: string[] }> },
	): Promise<NextResponse> => {
		// Load assets on first request
		const { css, js } = loadAssets();

		// Await params (Next.js 15 async requirement)
		const { slug } = await context.params;

		// Extract the first segment of the path
		const path = slug?.[0];

		// Serve JavaScript bundle
		if (path === "docutopia.js") {
			return new NextResponse(js, {
				headers: {
					"content-type": "application/javascript; charset=utf-8",
					"cache-control": "public, max-age=31536000, immutable",
				},
			});
		}

		// Serve HTML for all other routes (including root)
		// This supports React Router navigation
		const url = new URL(request.url);
		const basename = inferBasename(url.pathname, slug);

		const html = generateDocutopiaHTML({
			css,
			specUrl: options.specUrl,
			basename,
			baseUrl: options.baseUrl,
			title: options.title,
		});

		return new NextResponse(html, {
			headers: {
				"content-type": "text/html; charset=utf-8",
			},
		});
	};

	// Apply static configuration if requested
	if (options.static) {
		(GET as any).dynamic = "force-static";
		(GET as any).revalidate = false;
	}

	return { GET };
}

/**
 * Infers the basename for React Router from the URL pathname
 * Examples:
 * - /docs → /docs
 * - /docs/get-users → /docs
 * - /api/docs → /api/docs
 */
function inferBasename(pathname: string, slug?: string[]): string {
	// If no slug, pathname is the basename
	if (!slug || slug.length === 0) {
		return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
	}

	// Remove the slug segments from pathname to get basename
	// Example: /docs/get-users with slug=['get-users'] → /docs
	const slugPath = slug.join("/");
	const basename = pathname.replace(`/${slugPath}`, "").replace(/\/$/, "");

	return basename || "/";
}

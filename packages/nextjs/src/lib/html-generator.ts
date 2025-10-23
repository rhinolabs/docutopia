import type { HTMLGeneratorOptions } from "../types";

/**
 * Generates the HTML page for Docutopia documentation
 * This HTML includes:
 * - CSS inline
 * - Import Maps for React 19 from CDN
 * - Polyfill for Node.js process global
 * - Initialization script for the Docutopia React app
 */
export function generateDocutopiaHTML(options: HTMLGeneratorOptions): string {
	const {
		css,
		specUrl,
		basename,
		baseUrl,
		title = "API Documentation",
	} = options;

	// Escape values for safe HTML injection
	const safeTitle = escapeHtml(title);
	const safeSpecUrl = escapeHtml(specUrl);
	const safeBasename = escapeHtml(basename);
	const safeBaseUrl = baseUrl ? escapeHtml(baseUrl) : "window.location.origin";

	return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${safeTitle} - Docutopia</title>
	<style>${css}</style>

	<!-- Polyfill for Node.js globals in browser -->
	<script>
		window.process = window.process || { env: { NODE_ENV: 'production', VSCODE_TEXTMATE_DEBUG: false } };
	</script>

	<!-- Import Maps for React dependencies from CDN -->
	<script type="importmap">
		{
			"imports": {
				"react": "https://esm.sh/react@19.0.0",
				"react-dom": "https://esm.sh/react-dom@19.0.0",
				"react-dom/client": "https://esm.sh/react-dom@19.0.0/client",
				"react/jsx-runtime": "https://esm.sh/react@19.0.0/jsx-runtime"
			}
		}
	</script>
</head>
<body>
	<div id="root"></div>

	<!-- Initialize Docutopia -->
	<script type="module">
		import { Docutopia } from '${safeBasename}/docutopia.js';
		import { createRoot } from 'react-dom/client';
		import React from 'react';

		try {
			const element = document.getElementById('root');
			if (!element) {
				throw new Error('Root element not found');
			}

			const root = createRoot(element);
			root.render(
				React.createElement(Docutopia, {
					specUrl: '${safeSpecUrl}',
					baseUrl: ${safeBaseUrl},
					basename: '${safeBasename}'
				})
			);
		} catch (error) {
			console.error('Docutopia initialization error:', error);
			document.getElementById('root').innerHTML = \`
				<div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui;">
					<div style="text-align: center;">
						<h1 style="color: #dc2626;">Error Loading Docutopia</h1>
						<p>Failed to initialize: \${error.message}</p>
						<p style="color: #666; margin-top: 2rem;">
							You can still access the OpenAPI spec at:
							<a href="${safeSpecUrl}" style="color: #0066cc;">${safeSpecUrl}</a>
						</p>
					</div>
				</div>
			\`;
		}
	</script>
</body>
</html>`;
}

/**
 * Escapes HTML special characters to prevent XSS
 */
function escapeHtml(unsafe: string): string {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig(({ mode }) => {
	const isUMD = mode === "umd";

	return {
		plugins: [
			react(),
			dts({
				insertTypesEntry: true,
				outDir: isUMD ? "dist/browser" : "dist",
				rollupTypes: true,
			}),
		],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		// Dev server configuration (uses src/main.tsx when running `vite dev`)
		server: {
			open: true,
		},
		// Build configuration for library
		build: {
			lib: {
				entry: isUMD ? "./src/browser.tsx" : "./src/index.ts",
				name: isUMD ? "Docutopia" : undefined,
				fileName: "index",
				formats: isUMD ? ["umd"] : ["es"],
			},
			outDir: isUMD ? "dist/browser" : "dist",
			rollupOptions: {
				// Externalize peer dependencies
				external: ["react", "react-dom", "react/jsx-runtime"],
				output: {
					// Global variables for UMD build
					globals: isUMD
						? {
								react: "React",
								"react-dom": "ReactDOM",
								"react/jsx-runtime": "React",
							}
						: undefined,
					// Preserve CSS as separate files
					assetFileNames: (assetInfo) => {
						if (assetInfo.name === "style.css") return "index.css";
						return assetInfo.name;
					},
				},
			},
			// Generate sourcemaps
			sourcemap: true,
			// Clear output directory before build
			emptyOutDir: !isUMD, // Only clear on first build (ESM)
		},
	};
});

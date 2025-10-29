import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [
		dts({
			insertTypesEntry: true,
			outDir: "dist",
			rollupTypes: true,
			include: ["src/**/*", "lib/**/*"],
		}),
	],
	build: {
		// SSR build for Node.js environment
		ssr: true,
		lib: {
			entry: "./src/index.ts",
			fileName: "index",
			formats: ["es"],
		},
		outDir: "dist",
		rollupOptions: {
			// Externalize peer dependencies and dependencies
			external: [
				"react",
				"react-dom",
				"react/jsx-runtime",
				"react-router-dom",
				"fastify",
				"fastify-plugin",
				"@fastify/swagger",
				"@docutopia/react",
				/^node:.*/,
			],
		},
		// Generate sourcemaps
		sourcemap: true,
		// Target Node.js environment
		target: "node22",
		// Clear output directory before build
		emptyOutDir: true,
	},
});

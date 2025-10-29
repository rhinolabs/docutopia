import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		outDir: "dist/browser",
		lib: {
			entry: "./src/browser.tsx",
			formats: ["es"],
			fileName: "docutopia",
		},
		rollupOptions: {
			output: {
				// Bundle everything together for browser use
				inlineDynamicImports: true,
			},
		},
		sourcemap: false,
	},
	define: {
		"process.env.NODE_ENV": JSON.stringify("production"),
	},
});

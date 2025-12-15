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
			name: "Docutopia",
			formats: ["iife"],
			fileName: () => "docutopia.js",
		},
		rollupOptions: {
			output: {
				inlineDynamicImports: true,
				assetFileNames: "docutopia.[ext]",
			},
		},
		minify: "esbuild",
		cssCodeSplit: false,
		sourcemap: false,
	},
	define: {
		"process.env.NODE_ENV": JSON.stringify("production"),
	},
});

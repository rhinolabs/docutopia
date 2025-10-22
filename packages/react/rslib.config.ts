import path from "node:path";
import { pluginReact } from "@rsbuild/plugin-react";
import { defineConfig } from "@rslib/core";

export default defineConfig({
	lib: [
		{
			// ESM build for npm consumption
			format: "esm",
			syntax: "es2021",
			dts: {
				bundle: true,
			},
			source: {
				entry: {
					index: "./src/index.ts",
				},
			},
			output: {
				distPath: {
					root: "./dist",
				},
			},
		},
		{
			// UMD build for browser with self-initialization
			format: "umd",
			syntax: "es2021",
			umdName: "Docutopia",
			source: {
				entry: {
					index: "./src/browser.tsx",
				},
			},
			output: {
				distPath: {
					root: "./dist/browser",
				},
			},
		},
	],
	output: {
		target: "web",
	},
	plugins: [pluginReact()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});

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
			output: {
				distPath: {
					root: "./dist",
				},
			},
		},
		{
			// UMD build for browser
			format: "umd",
			syntax: "es2021",
			umdName: "Docutopia",
			output: {
				distPath: {
					root: "./dist/browser",
				},
			},
		},
	],
	source: {
		entry: {
			index: "./src/index.ts",
		},
	},
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

import path from "node:path";
import { defineConfig } from "@rslib/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
	lib: [
		{
			format: "esm",
			syntax: "es2021",
			dts: {
				bundle: true,
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
		distPath: {
			root: "./dist",
		},
	},
	plugins: [pluginReact()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
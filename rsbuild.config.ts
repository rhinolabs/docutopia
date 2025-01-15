import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { TanStackRouterRspack } from "@tanstack/router-plugin/rspack";
import path from "node:path";

export default defineConfig({
	source: {
		entry: {
			index: "./src/main.tsx",
		},
	},
	plugins: [pluginReact()],
	tools: {
		rspack: {
			plugins: [TanStackRouterRspack()],
		},
	},
	resolve: {
		extensions: [".js", ".jsx", ".ts", ".tsx"],
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});

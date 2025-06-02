import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginYaml } from "@rsbuild/plugin-yaml";
import path from "node:path";

export default defineConfig({
	source: {
		entry: {
			index: "./src/main.tsx",
		},
	},
	plugins: [pluginReact(), pluginYaml()],
	resolve: {
		extensions: [".js", ".jsx", ".ts", ".tsx"],
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});

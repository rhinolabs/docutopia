import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [
		react(),
		dts({
			insertTypesEntry: true,
			rollupTypes: true,
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		open: true,
	},
	build: {
		lib: {
			entry: "./src/index.ts",
			formats: ["es"],
			fileName: "index",
		},
		rollupOptions: {
			external: ["react", "react-dom", "react/jsx-runtime"],
			output: {
				assetFileNames: (assetInfo) => {
					if (assetInfo.name === "style.css") return "index.css";
					// biome-ignore lint/style/noNonNullAssertion:
					return assetInfo.name!;
				},
			},
		},
		// Generate sourcemaps
		sourcemap: true,
	},
	define: {
		"process.env.NODE_ENV": JSON.stringify("production"),
	},
});

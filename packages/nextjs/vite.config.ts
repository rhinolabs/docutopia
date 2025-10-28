import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [
		react(),
		dts({
			outDir: "dist",
			include: ["src/**/*"],
			exclude: ["**/*.test.ts", "**/*.test.tsx"],
		}),
	],
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			formats: ["es"],
			fileName: () => "index.js",
		},
		rollupOptions: {
			external: [
				"react",
				"react-dom",
				"react/jsx-runtime",
				"next",
				"next/link",
				"next/navigation",
				"@docutopia/react",
			],
		},
	},
});

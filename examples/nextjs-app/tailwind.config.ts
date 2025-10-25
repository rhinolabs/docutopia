import type { Config } from "tailwindcss";

export default {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"../../packages/react/src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {},
	},
	plugins: [],
} satisfies Config;

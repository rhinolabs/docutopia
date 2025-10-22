export const isAbsoluteUrlRegex = (url: string): boolean => {
	return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url);
};

export function joinPaths(...paths: string[]) {
	return paths
		.filter((path) => path && typeof path === "string")
		.map((path) => path.replace(/^\/+|\/+$/g, ""))
		.filter((path) => path.length > 0)
		.join("/");
}

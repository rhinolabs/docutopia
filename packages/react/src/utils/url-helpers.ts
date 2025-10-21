export const isAbsoluteUrlRegex = (url: string): boolean => {
	return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url);
};

export function joinPaths(...paths: string[]) {
	return paths
		.filter((path) => path && typeof path === "string") // Filtra valores vacíos/null
		.map((path) => path.replace(/^\/+|\/+$/g, "")) // Remueve slashes al inicio y final
		.filter((path) => path.length > 0) // Filtra strings vacíos después del trim
		.join("/");
}

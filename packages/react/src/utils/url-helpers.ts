export const isAbsoluteUrlRegex = (url: string): boolean => {
	return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url);
};
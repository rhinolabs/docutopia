export class OpenAPIParserError extends Error {
	constructor(message: string) {
		super(`OpenAPI Parser Error: ${message}`);
	}
}

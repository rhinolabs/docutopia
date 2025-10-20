import type { InfoObject, OpenApiDocument } from "@/types/api/openapi";
import { OpenAPIParserError } from "./errors";

export function validateRequiredFields(doc: OpenApiDocument) {
	if (!doc.openapi) {
		throw new OpenAPIParserError("Missing OpenAPI version");
	}

	if (!doc.info || !isValidInfoObject(doc.info)) {
		throw new OpenAPIParserError("Invalid or missing info object");
	}

	if (!doc.paths || typeof doc.paths !== "object") {
		throw new OpenAPIParserError("Invalid or missing paths object");
	}
}

export function isValidInfoObject(info: InfoObject): boolean {
	return typeof info.title === "string" && typeof info.version === "string";
}

export function validatePathSyntax(path: string) {
	const paramRegex = /{([^}]+)}/g;
	const params = path.match(paramRegex) || [];

	for (const param of params) {
		const paramName = param.slice(1, -1);

		if (!/^[a-zA-Z0-9_]+$/.test(paramName)) {
			throw new OpenAPIParserError(
				`Invalid path parameter name: ${paramName} in path: ${path}`,
			);
		}
	}
}

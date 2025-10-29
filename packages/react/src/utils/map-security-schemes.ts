import type { AuthCredentials, OpenApiDocument } from "@/core/types";

/**
 * Maps OpenAPI security schemes to Docutopia auth types
 *
 * @param spec - OpenAPI document specification
 * @returns Array of available auth types supported by both the spec and Docutopia
 *
 * @example
 * ```ts
 * const spec = await loadSpec(url);
 * const authTypes = getAvailableAuthTypes(spec);
 * // ["apiKey", "bearer"]
 * ```
 */
export function getAvailableAuthTypes(
	spec: OpenApiDocument,
): AuthCredentials["type"][] {
	const schemes = spec.components?.securitySchemes || {};
	const availableTypes = new Set<AuthCredentials["type"]>();

	for (const scheme of Object.values(schemes)) {
		switch (scheme.type) {
			case "apiKey":
				availableTypes.add("apiKey");
				break;

			case "http":
				if (scheme.scheme === "bearer") {
					availableTypes.add("bearer");
				} else if (scheme.scheme === "basic") {
					availableTypes.add("basic");
				}
				break;

			// oauth2 and openIdConnect are not yet supported by Docutopia
			case "oauth2":
			case "openIdConnect":
				// TODO: Add support for OAuth2 and OpenID Connect
				break;
		}
	}

	return Array.from(availableTypes);
}

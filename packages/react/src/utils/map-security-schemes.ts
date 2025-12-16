import type { AuthCredentials, OpenApiDocument } from "@/core/types";
import type {
	OAuth2SecurityScheme,
	OpenIdConnectSecurityScheme,
} from "@/types/api/openapi/security";

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
 * // ["apiKey", "bearer", "oauth2"]
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

			case "oauth2":
				availableTypes.add("oauth2");
				break;

			case "openIdConnect":
				availableTypes.add("openIdConnect");
				break;
		}
	}

	return Array.from(availableTypes);
}

/**
 * Gets the OAuth2 security scheme from the OpenAPI spec
 *
 * @param spec - OpenAPI document specification
 * @returns OAuth2 security scheme or null if not found
 */
export function getOAuth2Scheme(
	spec: OpenApiDocument,
): OAuth2SecurityScheme | null {
	const schemes = spec.components?.securitySchemes || {};

	for (const scheme of Object.values(schemes)) {
		if (scheme.type === "oauth2") {
			return scheme as OAuth2SecurityScheme;
		}
	}

	return null;
}

/**
 * Gets the OpenID Connect security scheme from the OpenAPI spec
 *
 * @param spec - OpenAPI document specification
 * @returns OpenID Connect security scheme or null if not found
 */
export function getOpenIdConnectScheme(
	spec: OpenApiDocument,
): OpenIdConnectSecurityScheme | null {
	const schemes = spec.components?.securitySchemes || {};

	for (const scheme of Object.values(schemes)) {
		if (scheme.type === "openIdConnect") {
			return scheme as OpenIdConnectSecurityScheme;
		}
	}

	return null;
}

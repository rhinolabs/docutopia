export interface SecurityObject {
	[type: string]: string[];
}

/**
 * Security Scheme Objects
 * @see https://spec.openapis.org/oas/v3.1.0#security-scheme-object
 */
export type SecuritySchemeObject =
	| ApiKeySecurityScheme
	| HttpSecurityScheme
	| OAuth2SecurityScheme
	| OpenIdConnectSecurityScheme;

export interface ApiKeySecurityScheme {
	type: "apiKey";
	name: string;
	in: "header" | "query" | "cookie";
	description?: string;
}

export interface HttpSecurityScheme {
	type: "http";
	scheme: "basic" | "bearer" | string;
	bearerFormat?: string;
	description?: string;
}

export interface OAuth2SecurityScheme {
	type: "oauth2";
	flows: OAuth2Flows;
	description?: string;
}

export interface OAuth2Flows {
	implicit?: OAuth2Flow;
	password?: OAuth2Flow;
	clientCredentials?: OAuth2Flow;
	authorizationCode?: OAuth2Flow;
}

export interface OAuth2Flow {
	authorizationUrl?: string;
	tokenUrl?: string;
	refreshUrl?: string;
	scopes: Record<string, string>;
}

export interface OpenIdConnectSecurityScheme {
	type: "openIdConnect";
	openIdConnectUrl: string;
	description?: string;
}

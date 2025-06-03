export const APP_CONFIG = {
	DEFAULT_SPEC_PATH: "/specs/openapi.json",
	REQUEST_TIMEOUT: 30000,
	MAX_RESPONSE_SIZE: 1024 * 1024, // 1MB
	SUPPORTED_AUTH_TYPES: ["apiKey", "bearer", "basic"] as const,
} as const;

export const UI_CONFIG = {
	SIDEBAR_WIDTH: 280,
	CONTENT_MAX_WIDTH: 1200,
	RESPONSE_MAX_HEIGHT: 400,
} as const;

export const ROUTES = {
	HOME: "/",
	ENDPOINT: "/:apiUrl",
} as const;

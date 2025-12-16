import type { OAuth2FlowType } from "@/core/types";

/**
 * OAuth2 Token Response from the authorization server
 */
export interface OAuth2TokenResponse {
	access_token: string;
	token_type: string;
	expires_in?: number;
	refresh_token?: string;
	scope?: string;
}

/**
 * OpenID Connect Discovery Configuration
 */
export interface OpenIdConfiguration {
	issuer: string;
	authorization_endpoint: string;
	token_endpoint: string;
	userinfo_endpoint?: string;
	jwks_uri?: string;
	scopes_supported?: string[];
	response_types_supported?: string[];
	grant_types_supported?: string[];
}

/**
 * Configuration for Authorization Code Flow
 */
export interface AuthCodeFlowConfig {
	authorizationUrl: string;
	tokenUrl: string;
	clientId: string;
	clientSecret?: string;
	redirectUri: string;
	scopes: string[];
	state?: string;
}

/**
 * Configuration for Client Credentials Flow
 */
export interface ClientCredentialsConfig {
	tokenUrl: string;
	clientId: string;
	clientSecret: string;
	scopes: string[];
}

/**
 * Configuration for Password Flow (Resource Owner)
 */
export interface PasswordFlowConfig {
	tokenUrl: string;
	clientId: string;
	clientSecret?: string;
	username: string;
	password: string;
	scopes: string[];
}

/**
 * PKCE (Proof Key for Code Exchange) utilities for secure Authorization Code flow
 */
function generateCodeVerifier(): string {
	const array = new Uint8Array(32);
	crypto.getRandomValues(array);
	return base64UrlEncode(array);
}

async function generateCodeChallenge(verifier: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(verifier);
	const digest = await crypto.subtle.digest("SHA-256", data);
	return base64UrlEncode(new Uint8Array(digest));
}

function base64UrlEncode(buffer: Uint8Array): string {
	const base64 = btoa(String.fromCharCode(...buffer));
	return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function generateState(): string {
	const array = new Uint8Array(16);
	crypto.getRandomValues(array);
	return base64UrlEncode(array);
}

/**
 * OAuth2 Client for handling different OAuth2 flows
 *
 * Supports:
 * - Authorization Code Flow (with PKCE for SPAs)
 * - Client Credentials Flow
 * - Password Flow (Resource Owner)
 * - Token Refresh
 * - OpenID Connect Discovery
 */
export class OAuth2Client {
	private codeVerifier: string | null = null;
	private state: string | null = null;

	/**
	 * Start Authorization Code Flow with PKCE
	 * Opens a popup or redirects to the authorization server
	 *
	 * @param config - Authorization Code flow configuration
	 * @param usePopup - Whether to use popup (true) or redirect (false)
	 * @returns Promise that resolves when popup is opened or redirect is initiated
	 */
	async startAuthCodeFlow(
		config: AuthCodeFlowConfig,
		usePopup = true,
	): Promise<{ authUrl: string; state: string; codeVerifier: string }> {
		// Generate PKCE code verifier and challenge
		this.codeVerifier = generateCodeVerifier();
		const codeChallenge = await generateCodeChallenge(this.codeVerifier);

		// Generate state for CSRF protection
		this.state = config.state || generateState();

		// Build authorization URL
		const params = new URLSearchParams({
			response_type: "code",
			client_id: config.clientId,
			redirect_uri: config.redirectUri,
			scope: config.scopes.join(" "),
			state: this.state,
			code_challenge: codeChallenge,
			code_challenge_method: "S256",
		});

		const authUrl = `${config.authorizationUrl}?${params.toString()}`;

		if (usePopup) {
			// Open popup for authorization
			const popup = window.open(
				authUrl,
				"oauth2-popup",
				"width=600,height=700,menubar=no,toolbar=no,location=no,status=no",
			);

			if (!popup) {
				throw new Error(
					"Failed to open popup. Please allow popups for this site.",
				);
			}
		}

		return {
			authUrl,
			state: this.state,
			codeVerifier: this.codeVerifier,
		};
	}

	/**
	 * Exchange authorization code for tokens
	 *
	 * @param config - Token exchange configuration
	 * @param code - Authorization code received from callback
	 * @param codeVerifier - PKCE code verifier used in authorization request
	 * @returns OAuth2 token response
	 */
	async exchangeCodeForToken(
		config: Pick<
			AuthCodeFlowConfig,
			"tokenUrl" | "clientId" | "clientSecret" | "redirectUri"
		>,
		code: string,
		codeVerifier: string,
	): Promise<OAuth2TokenResponse> {
		const body = new URLSearchParams({
			grant_type: "authorization_code",
			code,
			redirect_uri: config.redirectUri,
			client_id: config.clientId,
			code_verifier: codeVerifier,
		});

		// Add client_secret if provided (for confidential clients)
		if (config.clientSecret) {
			body.append("client_secret", config.clientSecret);
		}

		const response = await fetch(config.tokenUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: body.toString(),
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			throw new Error(
				error.error_description || error.error || "Token exchange failed",
			);
		}

		return response.json();
	}

	/**
	 * Get token using Client Credentials Flow
	 * Used for machine-to-machine authentication
	 *
	 * @param config - Client credentials configuration
	 * @returns OAuth2 token response
	 */
	async getClientCredentialsToken(
		config: ClientCredentialsConfig,
	): Promise<OAuth2TokenResponse> {
		const body = new URLSearchParams({
			grant_type: "client_credentials",
			client_id: config.clientId,
			client_secret: config.clientSecret,
			scope: config.scopes.join(" "),
		});

		const response = await fetch(config.tokenUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: body.toString(),
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			throw new Error(
				error.error_description ||
					error.error ||
					"Client credentials authentication failed",
			);
		}

		return response.json();
	}

	/**
	 * Get token using Password Flow (Resource Owner Password Credentials)
	 * Note: This flow is less secure and should only be used when other flows are not possible
	 *
	 * @param config - Password flow configuration
	 * @returns OAuth2 token response
	 */
	async getPasswordToken(
		config: PasswordFlowConfig,
	): Promise<OAuth2TokenResponse> {
		const body = new URLSearchParams({
			grant_type: "password",
			username: config.username,
			password: config.password,
			client_id: config.clientId,
			scope: config.scopes.join(" "),
		});

		// Add client_secret if provided
		if (config.clientSecret) {
			body.append("client_secret", config.clientSecret);
		}

		const response = await fetch(config.tokenUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: body.toString(),
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			throw new Error(
				error.error_description ||
					error.error ||
					"Password authentication failed",
			);
		}

		return response.json();
	}

	/**
	 * Refresh an access token using a refresh token
	 *
	 * @param tokenUrl - Token endpoint URL
	 * @param refreshToken - Refresh token
	 * @param clientId - Client ID
	 * @param clientSecret - Optional client secret
	 * @returns OAuth2 token response with new access token
	 */
	async refreshToken(
		tokenUrl: string,
		refreshToken: string,
		clientId: string,
		clientSecret?: string,
	): Promise<OAuth2TokenResponse> {
		const body = new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: refreshToken,
			client_id: clientId,
		});

		if (clientSecret) {
			body.append("client_secret", clientSecret);
		}

		const response = await fetch(tokenUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: body.toString(),
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			throw new Error(
				error.error_description || error.error || "Token refresh failed",
			);
		}

		return response.json();
	}

	/**
	 * Discover OpenID Connect configuration from the well-known endpoint
	 *
	 * @param discoveryUrl - OpenID Connect discovery URL (typically ends with /.well-known/openid-configuration)
	 * @returns OpenID Connect configuration
	 */
	async discoverOpenIdConfig(
		discoveryUrl: string,
	): Promise<OpenIdConfiguration> {
		// Ensure URL ends with well-known endpoint
		let url = discoveryUrl;
		if (!url.includes(".well-known")) {
			url = `${url.replace(/\/$/, "")}/.well-known/openid-configuration`;
		}

		const response = await fetch(url);

		if (!response.ok) {
			throw new Error("Failed to discover OpenID Connect configuration");
		}

		return response.json();
	}

	/**
	 * Get the stored state for CSRF verification
	 */
	getState(): string | null {
		return this.state;
	}

	/**
	 * Get the stored code verifier for PKCE
	 */
	getCodeVerifier(): string | null {
		return this.codeVerifier;
	}

	/**
	 * Clear stored PKCE and state values
	 */
	clearAuthState(): void {
		this.codeVerifier = null;
		this.state = null;
	}
}

/**
 * Helper to determine which flows are available from an OAuth2 security scheme
 */
export function getAvailableOAuth2Flows(flows: {
	implicit?: unknown;
	password?: unknown;
	clientCredentials?: unknown;
	authorizationCode?: unknown;
}): OAuth2FlowType[] {
	const available: OAuth2FlowType[] = [];

	if (flows.authorizationCode) available.push("authorizationCode");
	if (flows.clientCredentials) available.push("clientCredentials");
	if (flows.password) available.push("password");
	if (flows.implicit) available.push("implicit");

	return available;
}

/**
 * Get human-readable label for OAuth2 flow type
 */
export function getOAuth2FlowLabel(flow: OAuth2FlowType): string {
	const labels: Record<OAuth2FlowType, string> = {
		authorizationCode: "Authorization Code (Recommended)",
		clientCredentials: "Client Credentials",
		password: "Password",
		implicit: "Implicit (Deprecated)",
	};
	return labels[flow];
}

/**
 * Get description for OAuth2 flow type
 */
export function getOAuth2FlowDescription(flow: OAuth2FlowType): string {
	const descriptions: Record<OAuth2FlowType, string> = {
		authorizationCode:
			"Secure flow for web applications. Opens authorization page in a popup.",
		clientCredentials:
			"For machine-to-machine authentication. Requires client ID and secret.",
		password:
			"Direct username/password authentication. Less secure, use only when necessary.",
		implicit:
			"Legacy flow for SPAs. Deprecated in favor of Authorization Code with PKCE.",
	};
	return descriptions[flow];
}

// Export singleton instance for convenience
export const oauth2Client = new OAuth2Client();

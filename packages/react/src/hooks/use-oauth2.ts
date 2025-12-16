"use client";

import { useAuth } from "@/contexts/auth-context";
import {
	type AuthCodeFlowConfig,
	type ClientCredentialsConfig,
	OAuth2Client,
	type OAuth2TokenResponse,
	type OpenIdConfiguration,
	type PasswordFlowConfig,
} from "@/services/oauth2-client";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseOAuth2State {
	isAuthenticating: boolean;
	error: string | null;
	tokenExpiresAt: number | null;
}

interface UseOAuth2Return extends UseOAuth2State {
	/**
	 * Start Authorization Code flow with PKCE
	 * Opens a popup for user authentication
	 */
	startAuthCodeFlow: (
		config: Omit<AuthCodeFlowConfig, "redirectUri">,
	) => Promise<void>;

	/**
	 * Authenticate using Client Credentials flow
	 * For machine-to-machine authentication
	 */
	authenticateWithClientCredentials: (
		config: ClientCredentialsConfig,
	) => Promise<void>;

	/**
	 * Authenticate using Password flow
	 * Direct username/password authentication
	 */
	authenticateWithPassword: (config: PasswordFlowConfig) => Promise<void>;

	/**
	 * Refresh the current access token
	 */
	refreshAccessToken: () => Promise<void>;

	/**
	 * Check if token is expired or about to expire
	 */
	isTokenExpired: () => boolean;

	/**
	 * Discover OpenID Connect configuration
	 */
	discoverOpenIdConfig: (discoveryUrl: string) => Promise<OpenIdConfiguration>;

	/**
	 * Clear OAuth2 authentication state
	 */
	clearOAuth2Auth: () => void;
}

/**
 * Hook for managing OAuth2 authentication flows
 *
 * @example
 * ```tsx
 * const { startAuthCodeFlow, isAuthenticating, error } = useOAuth2();
 *
 * const handleAuth = async () => {
 *   await startAuthCodeFlow({
 *     authorizationUrl: 'https://auth.example.com/authorize',
 *     tokenUrl: 'https://auth.example.com/token',
 *     clientId: 'my-client-id',
 *     scopes: ['read', 'write'],
 *   });
 * };
 * ```
 */
export function useOAuth2(): UseOAuth2Return {
	const { credentials, updateCredentials, clearCredentials } = useAuth();
	const [state, setState] = useState<UseOAuth2State>({
		isAuthenticating: false,
		error: null,
		tokenExpiresAt: credentials.oauth2?.expiresAt || null,
	});

	const oauth2ClientRef = useRef(new OAuth2Client());
	const pendingAuthRef = useRef<{
		config: Omit<AuthCodeFlowConfig, "redirectUri">;
		codeVerifier: string;
		state: string;
	} | null>(null);

	// Get redirect URI for OAuth2 callbacks
	const getRedirectUri = useCallback(() => {
		if (typeof window === "undefined") return "";
		return `${window.location.origin}${window.location.pathname}`;
	}, []);

	// Handle OAuth2 callback messages from popup
	useEffect(() => {
		const handleMessage = async (event: MessageEvent) => {
			// Verify origin
			if (event.origin !== window.location.origin) return;

			const { type, code, state: returnedState, error } = event.data || {};

			if (type !== "oauth2-callback") return;

			if (error) {
				setState((prev) => ({
					...prev,
					isAuthenticating: false,
					error: error,
				}));
				return;
			}

			if (!pendingAuthRef.current) {
				setState((prev) => ({
					...prev,
					isAuthenticating: false,
					error: "No pending authentication request",
				}));
				return;
			}

			// Verify state for CSRF protection
			if (returnedState !== pendingAuthRef.current.state) {
				setState((prev) => ({
					...prev,
					isAuthenticating: false,
					error: "State mismatch - possible CSRF attack",
				}));
				pendingAuthRef.current = null;
				return;
			}

			try {
				// Exchange code for token
				const tokenResponse =
					await oauth2ClientRef.current.exchangeCodeForToken(
						{
							tokenUrl: pendingAuthRef.current.config.tokenUrl,
							clientId: pendingAuthRef.current.config.clientId,
							clientSecret: pendingAuthRef.current.config.clientSecret,
							redirectUri: getRedirectUri(),
						},
						code,
						pendingAuthRef.current.codeVerifier,
					);

				handleTokenResponse(tokenResponse, pendingAuthRef.current.config);
				pendingAuthRef.current = null;
			} catch (err) {
				setState((prev) => ({
					...prev,
					isAuthenticating: false,
					error: err instanceof Error ? err.message : "Token exchange failed",
				}));
				pendingAuthRef.current = null;
			}
		};

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, [getRedirectUri]);

	// Handle successful token response
	const handleTokenResponse = useCallback(
		(
			response: OAuth2TokenResponse,
			config: { tokenUrl: string; clientId: string; scopes: string[] },
		) => {
			const expiresAt = response.expires_in
				? Date.now() + response.expires_in * 1000
				: undefined;

			updateCredentials({
				type: "oauth2",
				value: response.access_token,
				oauth2: {
					flow: "authorizationCode",
					clientId: config.clientId,
					tokenUrl: config.tokenUrl,
					scopes: config.scopes,
					refreshToken: response.refresh_token,
					expiresAt,
				},
			});

			setState({
				isAuthenticating: false,
				error: null,
				tokenExpiresAt: expiresAt || null,
			});
		},
		[updateCredentials],
	);

	// Start Authorization Code flow
	const startAuthCodeFlow = useCallback(
		async (config: Omit<AuthCodeFlowConfig, "redirectUri">) => {
			setState((prev) => ({ ...prev, isAuthenticating: true, error: null }));

			try {
				const fullConfig: AuthCodeFlowConfig = {
					...config,
					redirectUri: getRedirectUri(),
				};

				const { state, codeVerifier } =
					await oauth2ClientRef.current.startAuthCodeFlow(fullConfig);

				// Store pending auth info for callback handling
				pendingAuthRef.current = {
					config,
					codeVerifier,
					state,
				};
			} catch (err) {
				setState((prev) => ({
					...prev,
					isAuthenticating: false,
					error:
						err instanceof Error ? err.message : "Failed to start auth flow",
				}));
			}
		},
		[getRedirectUri],
	);

	// Authenticate with Client Credentials
	const authenticateWithClientCredentials = useCallback(
		async (config: ClientCredentialsConfig) => {
			setState((prev) => ({ ...prev, isAuthenticating: true, error: null }));

			try {
				const response =
					await oauth2ClientRef.current.getClientCredentialsToken(config);

				const expiresAt = response.expires_in
					? Date.now() + response.expires_in * 1000
					: undefined;

				updateCredentials({
					type: "oauth2",
					value: response.access_token,
					oauth2: {
						flow: "clientCredentials",
						clientId: config.clientId,
						clientSecret: config.clientSecret,
						tokenUrl: config.tokenUrl,
						scopes: config.scopes,
						expiresAt,
					},
				});

				setState({
					isAuthenticating: false,
					error: null,
					tokenExpiresAt: expiresAt || null,
				});
			} catch (err) {
				setState((prev) => ({
					...prev,
					isAuthenticating: false,
					error:
						err instanceof Error
							? err.message
							: "Client credentials authentication failed",
				}));
			}
		},
		[updateCredentials],
	);

	// Authenticate with Password
	const authenticateWithPassword = useCallback(
		async (config: PasswordFlowConfig) => {
			setState((prev) => ({ ...prev, isAuthenticating: true, error: null }));

			try {
				const response = await oauth2ClientRef.current.getPasswordToken(config);

				const expiresAt = response.expires_in
					? Date.now() + response.expires_in * 1000
					: undefined;

				updateCredentials({
					type: "oauth2",
					value: response.access_token,
					oauth2: {
						flow: "password",
						clientId: config.clientId,
						tokenUrl: config.tokenUrl,
						scopes: config.scopes,
						refreshToken: response.refresh_token,
						expiresAt,
					},
				});

				setState({
					isAuthenticating: false,
					error: null,
					tokenExpiresAt: expiresAt || null,
				});
			} catch (err) {
				setState((prev) => ({
					...prev,
					isAuthenticating: false,
					error:
						err instanceof Error
							? err.message
							: "Password authentication failed",
				}));
			}
		},
		[updateCredentials],
	);

	// Refresh access token
	const refreshAccessToken = useCallback(async () => {
		if (!credentials.oauth2?.refreshToken || !credentials.oauth2?.tokenUrl) {
			setState((prev) => ({
				...prev,
				error: "No refresh token available",
			}));
			return;
		}

		setState((prev) => ({ ...prev, isAuthenticating: true, error: null }));

		try {
			const response = await oauth2ClientRef.current.refreshToken(
				credentials.oauth2.tokenUrl,
				credentials.oauth2.refreshToken,
				credentials.oauth2.clientId,
				credentials.oauth2.clientSecret,
			);

			const expiresAt = response.expires_in
				? Date.now() + response.expires_in * 1000
				: undefined;

			updateCredentials({
				value: response.access_token,
				oauth2: {
					...credentials.oauth2,
					refreshToken:
						response.refresh_token || credentials.oauth2.refreshToken,
					expiresAt,
				},
			});

			setState({
				isAuthenticating: false,
				error: null,
				tokenExpiresAt: expiresAt || null,
			});
		} catch (err) {
			setState((prev) => ({
				...prev,
				isAuthenticating: false,
				error: err instanceof Error ? err.message : "Token refresh failed",
			}));
		}
	}, [credentials.oauth2, updateCredentials]);

	// Check if token is expired
	const isTokenExpired = useCallback(() => {
		if (!state.tokenExpiresAt) return false;
		// Consider token expired 60 seconds before actual expiration
		return Date.now() > state.tokenExpiresAt - 60000;
	}, [state.tokenExpiresAt]);

	// Discover OpenID Connect configuration
	const discoverOpenIdConfig = useCallback(async (discoveryUrl: string) => {
		return oauth2ClientRef.current.discoverOpenIdConfig(discoveryUrl);
	}, []);

	// Clear OAuth2 authentication
	const clearOAuth2Auth = useCallback(() => {
		clearCredentials();
		oauth2ClientRef.current.clearAuthState();
		pendingAuthRef.current = null;
		setState({
			isAuthenticating: false,
			error: null,
			tokenExpiresAt: null,
		});
	}, [clearCredentials]);

	return {
		...state,
		startAuthCodeFlow,
		authenticateWithClientCredentials,
		authenticateWithPassword,
		refreshAccessToken,
		isTokenExpired,
		discoverOpenIdConfig,
		clearOAuth2Auth,
	};
}

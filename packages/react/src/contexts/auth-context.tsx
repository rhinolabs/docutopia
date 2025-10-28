"use client";

import type { AuthCredentials } from "@/core/types";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthContextValue } from "./types";

/**
 * Context for authentication credentials
 */
const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Hook to access the auth context
 * Throws error if used outside of AuthProvider
 */
export function useAuth(): AuthContextValue {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error(
			"useAuth must be used within an AuthProvider. " +
				"Make sure your component is wrapped with <AuthProvider>.",
		);
	}

	return context;
}

const STORAGE_KEY = "docutopia-auth";

const defaultCredentials: AuthCredentials = {
	type: "apiKey",
	value: "",
	keyName: "x-api-key",
	location: "header",
};

const authTypeDefaults: Record<
	AuthCredentials["type"],
	Partial<AuthCredentials>
> = {
	apiKey: {
		keyName: "x-api-key",
		location: "header",
	},
	bearer: {
		prefix: "Bearer ",
		location: "header",
	},
	basic: {
		location: "header",
	},
};

/**
 * Provider component for authentication credentials
 *
 * Manages authentication credentials with automatic persistence to localStorage.
 * This is client-side only state that persists across page reloads.
 *
 * @example
 * ```tsx
 * <AuthProvider>
 *   <TryApiPanel />
 * </AuthProvider>
 * ```
 */
export function AuthProvider({ children }: { children: ReactNode }) {
	const [credentials, setCredentials] =
		useState<AuthCredentials>(defaultCredentials);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isHydrated, setIsHydrated] = useState(false);

	// Load from localStorage on mount (client-side only)
	useEffect(() => {
		if (typeof window === "undefined") return;

		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored);
				setCredentials(parsed.credentials || defaultCredentials);
				setIsAuthenticated(parsed.isAuthenticated || false);
			}
		} catch (error) {
			console.error("Failed to load auth from localStorage:", error);
		}

		setIsHydrated(true);
	}, []);

	// Save to localStorage whenever credentials change
	useEffect(() => {
		if (!isHydrated || typeof window === "undefined") return;

		try {
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({
					credentials,
					isAuthenticated,
				}),
			);
		} catch (error) {
			console.error("Failed to save auth to localStorage:", error);
		}
	}, [credentials, isAuthenticated, isHydrated]);

	const updateCredentials = useCallback(
		(newCredentials: Partial<AuthCredentials>) => {
			setCredentials((prev) => {
				const updated = {
					...prev,
					...newCredentials,
				};

				const authenticated = Boolean(
					updated.value &&
						(updated.type !== "basic" || updated.username),
				);

				setIsAuthenticated(authenticated);
				return updated;
			});
		},
		[],
	);

	const clearCredentials = useCallback(() => {
		setCredentials(defaultCredentials);
		setIsAuthenticated(false);
	}, []);

	const setAuthType = useCallback((type: AuthCredentials["type"]) => {
		setCredentials((prev) => ({
			...prev,
			type,
			...authTypeDefaults[type],
			value: "", // Reset value when changing type
		}));
	}, []);

	const generateAuthHeaders = useCallback((): Record<string, string> => {
		const headers: Record<string, string> = {};

		if (!credentials.value) return headers;

		switch (credentials.type) {
			case "apiKey":
				if (credentials.location === "header") {
					headers[credentials.keyName || "x-api-key"] = credentials.value;
				}
				break;

			case "bearer":
				headers.Authorization = `${credentials.prefix || "Bearer "}${credentials.value}`;
				break;

			case "basic":
				if (credentials.username) {
					const encoded = btoa(
						`${credentials.username}:${credentials.value}`,
					);
					headers.Authorization = `Basic ${encoded}`;
				}
				break;
		}

		return headers;
	}, [credentials]);

	const generateAuthQuery = useCallback((): Record<string, string> => {
		const query: Record<string, string> = {};

		if (!credentials.value || credentials.location !== "query") return query;

		if (credentials.type === "apiKey") {
			query[credentials.keyName || "api_key"] = credentials.value;
		}

		return query;
	}, [credentials]);

	const value: AuthContextValue = {
		credentials,
		isAuthenticated,
		updateCredentials,
		clearCredentials,
		setAuthType,
		generateAuthHeaders,
		generateAuthQuery,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

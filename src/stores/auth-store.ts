import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthCredentials } from "@/core/types";

interface AuthState {
	credentials: AuthCredentials;
	isAuthenticated: boolean;

	updateCredentials: (credentials: Partial<AuthCredentials>) => void;
	clearCredentials: () => void;
	setAuthType: (type: AuthCredentials["type"]) => void;
	generateAuthHeaders: () => Record<string, string>;
	generateAuthQuery: () => Record<string, string>;
}

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
	cookie: {
		keyName: "session_token",
		location: "cookie",
	},
};

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			credentials: defaultCredentials,

			get isAuthenticated() {
				const creds = get().credentials;
				return Boolean(
					creds.value && (creds.type !== "basic" || creds.username),
				);
			},

			updateCredentials: (newCredentials) =>
				set((state) => ({
					credentials: { ...state.credentials, ...newCredentials },
				})),

			clearCredentials: () => set({ credentials: defaultCredentials }),

			setAuthType: (type) =>
				set((state) => ({
					credentials: {
						...state.credentials,
						type,
						...authTypeDefaults[type],
						value: "", // Reset value when changing type
					},
				})),

			generateAuthHeaders: () => {
				const { credentials } = get();
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

					case "cookie":
						if (credentials.location === "header") {
							headers.Cookie = `${credentials.keyName || "session_token"}=${credentials.value}`;
						}
						break;
				}

				return headers;
			},

			generateAuthQuery: () => {
				const { credentials } = get();
				const query: Record<string, string> = {};

				if (!credentials.value || credentials.location !== "query")
					return query;

				if (credentials.type === "apiKey") {
					query[credentials.keyName || "api_key"] = credentials.value;
				}

				return query;
			},
		}),
		{
			name: "docutopia-auth",
			partialize: (state) => ({ credentials: state.credentials }),
		},
	),
);

// Export hook for easier consumption
export const useAuth = () => {
	const store = useAuthStore();

	return {
		credentials: store.credentials,
		isAuthenticated: store.isAuthenticated,
		updateCredentials: store.updateCredentials,
		clearCredentials: store.clearCredentials,
		setAuthType: store.setAuthType,
		generateAuthHeaders: store.generateAuthHeaders,
		generateAuthQuery: store.generateAuthQuery,
	};
};

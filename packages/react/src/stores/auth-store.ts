import type { AuthCredentials } from "@/core/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
};

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			credentials: defaultCredentials,
			isAuthenticated: false,

			updateCredentials: (newCredentials) =>
				set((state) => {
					const updatedCredentials = {
						...state.credentials,
						...newCredentials,
					};
					const isAuthenticated = Boolean(
						updatedCredentials.value &&
							(updatedCredentials.type !== "basic" ||
								updatedCredentials.username)
					);
					return {
						credentials: updatedCredentials,
						isAuthenticated,
					};
				}),

			clearCredentials: () =>
				set({ credentials: defaultCredentials, isAuthenticated: false }),

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
			partialize: (state) => ({
				credentials: state.credentials,
				isAuthenticated: state.isAuthenticated,
			}),
		},
	),
);

// Export hook for easier consumption
export const useAuth = () => {
	const credentials = useAuthStore((state) => state.credentials);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const updateCredentials = useAuthStore((state) => state.updateCredentials);
	const clearCredentials = useAuthStore((state) => state.clearCredentials);
	const setAuthType = useAuthStore((state) => state.setAuthType);
	const generateAuthHeaders = useAuthStore(
		(state) => state.generateAuthHeaders,
	);
	const generateAuthQuery = useAuthStore((state) => state.generateAuthQuery);

	return {
		credentials,
		isAuthenticated,
		updateCredentials,
		clearCredentials,
		setAuthType,
		generateAuthHeaders,
		generateAuthQuery,
	};
};

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthCredentials } from "@/core/types";

interface AuthState {
	credentials: AuthCredentials;
	isAuthenticated: boolean;

	updateCredentials: (credentials: Partial<AuthCredentials>) => void;
	clearCredentials: () => void;
	setAuthType: (type: AuthCredentials["type"]) => void;
}

const defaultCredentials: AuthCredentials = {
	type: "apiKey",
	value: "",
};

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			credentials: defaultCredentials,

			get isAuthenticated() {
				return Boolean(get().credentials.value);
			},

			updateCredentials: (newCredentials) =>
				set((state) => ({
					credentials: { ...state.credentials, ...newCredentials },
				})),

			clearCredentials: () => set({ credentials: defaultCredentials }),

			setAuthType: (type) =>
				set((state) => ({
					credentials: { ...state.credentials, type },
				})),
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
	};
};

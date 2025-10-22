import type { RequestParameters } from "@/core/types";
import { create } from "zustand";

interface RequestParamsState {
	params: RequestParameters;
	updatePathParam: (name: string, value: unknown) => void;
	updateQueryParam: (name: string, value: unknown) => void;
	updateBodyParam: (path: string[], value: unknown) => void;
	clearParams: () => void;
	setAllParams: (params: RequestParameters) => void;
}

const initialParams: RequestParameters = {
	path: {},
	query: {},
	body: {},
};

export const useRequestParamsStore = create<RequestParamsState>((set) => ({
	params: initialParams,

	updatePathParam: (name, value) =>
		set((state) => ({
			params: {
				...state.params,
				path: {
					...state.params.path,
					[name]: value,
				},
			},
		})),

	updateQueryParam: (name, value) =>
		set((state) => ({
			params: {
				...state.params,
				query: {
					...state.params.query,
					[name]: value,
				},
			},
		})),

	updateBodyParam: (path, value) =>
		set((state) => {
			const newBody = { ...(state.params.body as Record<string, unknown>) };

			// Navigate through the path and set the value
			if (path.length === 1) {
				newBody[path[0]] = value;
			} else {
				let current: Record<string, unknown> | unknown[] = newBody;
				for (let i = 0; i < path.length - 1; i++) {
					const key = path[i];
					const nextKey = path[i + 1];

					// Check if current position exists and is the right type
					if (!current[key] || typeof current[key] !== "object") {
						// Create array if next key is a number, otherwise create object
						current[key] =
							typeof nextKey === "number" || !Number.isNaN(Number(nextKey))
								? []
								: {};
					}

					current = current[key] as Record<string, unknown> | unknown[];
				}

				const lastKey = path[path.length - 1];
				if (Array.isArray(current)) {
					current[Number(lastKey)] = value;
				} else {
					(current as Record<string, unknown>)[lastKey] = value;
				}
			}

			return {
				params: {
					...state.params,
					body: newBody,
				},
			};
		}),

	clearParams: () => set({ params: initialParams }),

	setAllParams: (params) => set({ params }),
}));

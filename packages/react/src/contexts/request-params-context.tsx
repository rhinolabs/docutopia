"use client";

import type { RequestParameters } from "@/core/types";
import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { RequestParamsContextValue } from "./types";

/**
 * Context for request parameters
 */
const RequestParamsContext = createContext<RequestParamsContextValue | null>(
	null,
);

/**
 * Hook to access the request parameters context
 * Throws error if used outside of RequestParamsProvider
 */
export function useRequestParams(): RequestParamsContextValue {
	const context = useContext(RequestParamsContext);

	if (!context) {
		throw new Error(
			"useRequestParams must be used within a RequestParamsProvider. " +
				"Make sure your component is wrapped with <RequestParamsProvider>.",
		);
	}

	return context;
}

const initialParams: RequestParameters = {
	path: {},
	query: {},
	body: {},
};

/**
 * Provider component for request parameters
 *
 * Manages parameters for the "Try It" feature.
 * This is client-side only state that resets when the component unmounts.
 *
 * @example
 * ```tsx
 * <RequestParamsProvider>
 *   <TryApiPanel />
 * </RequestParamsProvider>
 * ```
 */
export function RequestParamsProvider({ children }: { children: ReactNode }) {
	const [params, setParams] = useState<RequestParameters>(initialParams);

	const updatePathParam = useCallback((name: string, value: unknown) => {
		setParams((prev) => ({
			...prev,
			path: {
				...prev.path,
				[name]: value,
			},
		}));
	}, []);

	const updateQueryParam = useCallback((name: string, value: unknown) => {
		setParams((prev) => ({
			...prev,
			query: {
				...prev.query,
				[name]: value,
			},
		}));
	}, []);

	const updateBodyParam = useCallback(
		(path: (string | number)[], value: unknown) => {
			setParams((prev) => {
				const newBody = { ...(prev.body as Record<string, unknown>) };

				// Navigate through the path and set the value
				if (path.length === 1) {
					newBody[path[0]] = value;
				} else {
					let current: Record<string, unknown> | unknown[] = newBody;
					for (let i = 0; i < path.length - 1; i++) {
						const key = path[i];
						const nextKey = path[i + 1];

						// Type-safe access for arrays and objects
						const currentValue = Array.isArray(current)
							? current[Number(key)]
							: (current as Record<string, unknown>)[key];

						// Check if current position exists and is the right type
						if (!currentValue || typeof currentValue !== "object") {
							// Create array if next key is a number, otherwise create object
							const newValue =
								typeof nextKey === "number" || !Number.isNaN(Number(nextKey))
									? []
									: {};

							if (Array.isArray(current)) {
								current[Number(key)] = newValue;
							} else {
								(current as Record<string, unknown>)[key] = newValue;
							}

							current = newValue as Record<string, unknown> | unknown[];
						} else {
							current = currentValue as Record<string, unknown> | unknown[];
						}
					}

					const lastKey = path[path.length - 1];
					if (Array.isArray(current)) {
						current[Number(lastKey)] = value;
					} else {
						(current as Record<string, unknown>)[lastKey] = value;
					}
				}

				return {
					...prev,
					body: newBody,
				};
			});
		},
		[],
	);

	const clearParams = useCallback(() => {
		setParams(initialParams);
	}, []);

	const deleteParamAtPath = useCallback((path: (string | number)[]) => {
		if (path.length === 0) {
			setParams((prev) => ({
				...prev,
				body: {},
			}));
			return;
		}

		setParams((prev) => {
			const newBody = { ...(prev.body as Record<string, unknown>) };

			// If path has only one element, delete directly from root
			if (path.length === 1) {
				delete newBody[path[0]];
				return {
					...prev,
					body: newBody,
				};
			}

			// Navigate to the parent of the target key
			let current: Record<string, unknown> | unknown[] = newBody;
			for (let i = 0; i < path.length - 1; i++) {
				const key = path[i];

				if (Array.isArray(current)) {
					current = current[Number(key)] as Record<string, unknown> | unknown[];
				} else {
					current = (current as Record<string, unknown>)[key] as
						| Record<string, unknown>
						| unknown[];
				}

				// If we can't navigate to the parent, the path doesn't exist
				if (!current || typeof current !== "object") {
					return prev; // Return unchanged state
				}
			}

			// Delete the last key
			const lastKey = path[path.length - 1];
			if (Array.isArray(current)) {
				current.splice(Number(lastKey), 1);
			} else {
				delete (current as Record<string, unknown>)[lastKey];
			}

			return {
				...prev,
				body: newBody,
			};
		});
	}, []);

	const setAllParams = useCallback((newParams: RequestParameters) => {
		setParams(newParams);
	}, []);

	const value: RequestParamsContextValue = {
		params,
		updatePathParam,
		updateQueryParam,
		updateBodyParam,
		deleteParamAtPath,
		clearParams,
		setAllParams,
	};

	return (
		<RequestParamsContext.Provider value={value}>
			{children}
		</RequestParamsContext.Provider>
	);
}

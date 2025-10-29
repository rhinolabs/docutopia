"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import type { ReactNode } from "react";

/**
 * Sidebar state tracking which groups are expanded/collapsed
 */
export interface SidebarState {
	expandedGroups: Record<string, boolean>;
}

/**
 * Context value for sidebar state management
 */
export interface SidebarStateContextValue {
	/**
	 * Map of group names to their expanded state
	 */
	expandedGroups: Record<string, boolean>;
	/**
	 * Toggle a group's expanded state
	 */
	toggleGroup: (groupName: string) => void;
	/**
	 * Set expanded state for a specific group
	 */
	setGroupExpanded: (groupName: string, expanded: boolean) => void;
}

/**
 * Context for sidebar state
 */
const SidebarStateContext = createContext<SidebarStateContextValue | null>(
	null,
);

/**
 * Hook to access the sidebar state context
 * Throws error if used outside of SidebarStateProvider
 */
export function useSidebarState(): SidebarStateContextValue {
	const context = useContext(SidebarStateContext);

	if (!context) {
		throw new Error(
			"useSidebarState must be used within a SidebarStateProvider. " +
				"Make sure your component is wrapped with <SidebarStateProvider>.",
		);
	}

	return context;
}

const STORAGE_KEY = "docutopia-sidebar-state";

/**
 * Provider component for sidebar state
 *
 * Persists expanded/collapsed state of sidebar groups in localStorage
 *
 * @example
 * ```tsx
 * <SidebarStateProvider>
 *   <AppSidebar />
 * </SidebarStateProvider>
 * ```
 */
export function SidebarStateProvider({ children }: { children: ReactNode }) {
	// Load initial state from localStorage (client-side only)
	const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
		() => {
			if (typeof window === "undefined") {
				return {};
			}

			try {
				const stored = localStorage.getItem(STORAGE_KEY);
				return stored ? JSON.parse(stored) : {};
			} catch (error) {
				console.error("Failed to load sidebar state from localStorage:", error);
				return {};
			}
		},
	);

	// Save to localStorage whenever state changes
	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(expandedGroups));
		} catch (error) {
			console.error("Failed to save sidebar state to localStorage:", error);
		}
	}, [expandedGroups]);

	// Toggle a group's expanded state
	const toggleGroup = useCallback((groupName: string) => {
		setExpandedGroups((prev) => ({
			...prev,
			[groupName]: !prev[groupName],
		}));
	}, []);

	// Set expanded state for a specific group
	const setGroupExpanded = useCallback(
		(groupName: string, expanded: boolean) => {
			setExpandedGroups((prev) => ({
				...prev,
				[groupName]: expanded,
			}));
		},
		[],
	);

	const value: SidebarStateContextValue = {
		expandedGroups,
		toggleGroup,
		setGroupExpanded,
	};

	return (
		<SidebarStateContext.Provider value={value}>
			{children}
		</SidebarStateContext.Provider>
	);
}

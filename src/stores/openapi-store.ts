import { create } from "zustand";
import type { OpenApiDocument, EnhancedOperation } from "@/core/types";
import { OpenApiService } from "@/services/openapi-service";

interface OpenApiState {
	spec: OpenApiDocument | null;
	isLoading: boolean;
	error: string | null;
	selectedEndpoint: string | null;

	loadSpec: (specPath: string) => Promise<void>;
	selectEndpoint: (endpoint: string) => void;
	clearError: () => void;
	reset: () => void;
	getOperationBySlug: (slug: string) => EnhancedOperation | null;
}

export const useOpenApiStore = create<OpenApiState>((set, get) => ({
	spec: null,
	isLoading: false,
	error: null,
	selectedEndpoint: null,

	loadSpec: async (specPath: string) => {
		set({ isLoading: true, error: null });

		try {
			const openApiService = new OpenApiService();
			const spec = await openApiService.loadSpec(specPath);
			set({ spec, isLoading: false, error: null });
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : "Unknown error",
				isLoading: false,
			});
		}
	},

	selectEndpoint: (endpoint: string) => set({ selectedEndpoint: endpoint }),
	clearError: () => set({ error: null }),
	reset: () =>
		set({ spec: null, isLoading: false, error: null, selectedEndpoint: null }),

	getOperationBySlug: (slug: string) => {
		const { spec } = get();
		if (!spec) return null;
		const service = new OpenApiService();
		return service.findOperationBySlug(spec, slug);
	},
}));

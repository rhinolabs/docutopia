import type { EnhancedOperation, OpenApiDocument } from "@/core/types";
import { OpenApiService } from "@/services/openapi-service";
import { create } from "zustand";

interface OpenApiState {
	spec: OpenApiDocument | null;
	isLoading: boolean;
	error: string | null;
	selectedEndpoint: string | null;
	specPath?: string;
	baseUrl?: string;

	loadSpec: (specPath: string, baseUrl?: string) => Promise<void>;
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

	loadSpec: async (specPath: string, baseUrl?: string) => {
		set({ isLoading: true, error: null });

		try {
			const openApiService = new OpenApiService();
			const spec = await openApiService.loadSpec(specPath);
			set({ spec, isLoading: false, error: null, specPath, baseUrl });
			console.log("Loaded OpenAPI spec: ", spec);
		} catch (error) {
			console.error("Failed to load spec from", specPath, error);
			set({
				spec: null,
				isLoading: false,
				error: `Failed to load spec: ${error instanceof Error ? error.message : "Unknown error"}`,
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

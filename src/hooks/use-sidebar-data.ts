import { useMemo } from "react";
import { useOpenApiStore } from "@/stores/openapi-store";
import type { SidebarCollection } from "@/types/components/sidebar";
import type {
	OpenApiDocument,
	PathItemObject,
	OperationObject,
} from "@/core/types";

interface SidebarData {
	collections: SidebarCollection[];
	totalEndpoints: number;
	isLoading: boolean;
	error: string | null;
	specInfo: {
		title: string;
		version: string;
		serversCount: number;
	} | null;
}

// Helper to generate slug from string (matches OpenApiService.generateSlug)
const generateSlug = (input: string): string => {
	return input
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-+/, "")
		.replace(/-+$/, "");
};

// Generate sidebar data from raw OpenAPI spec
const generateSidebarFromSpec = (
	spec: OpenApiDocument,
): SidebarCollection[] => {
	const tagGroups = new Map<
		string,
		Array<{
			id: string;
			name: string;
			method: string;
			path: string;
			url: string;
		}>
	>();

	// Group operations by tags
	for (const [path, pathItem] of Object.entries(spec.paths || {})) {
		for (const [method, operation] of Object.entries(
			pathItem as PathItemObject,
		)) {
			if (typeof operation !== "object" || !operation) continue;
			const op = operation as OperationObject;

			const tags = op.tags || ["Untagged"];
			// Use same fallback logic as OpenApiService.findOperationBySlug
			const operationId =
				(op as OperationObject & { operationId?: string }).operationId ||
				op.summary ||
				path;
			const slug = generateSlug(operationId);

			for (const tag of tags) {
				if (!tagGroups.has(tag)) {
					tagGroups.set(tag, []);
				}
				tagGroups.get(tag)?.push({
					id: operationId,
					name:
						op.summary || op.description || `${method.toUpperCase()} ${path}`,
					method: method.toUpperCase(),
					path: path,
					url: slug, // Use slug directly without /api/ prefix
				});
			}
		}
	}

	// Convert to SidebarCollection format
	return Array.from(tagGroups.entries()).map(([tag, requests]) => ({
		id: tag.toLowerCase().replace(/\s+/g, "-"),
		name: tag,
		requests: requests.map((req) => ({
			id: req.id,
			name: req.name,
			method: req.method,
			url: req.url,
		})),
	}));
};

export const useSidebarData = (): SidebarData => {
	const { spec, isLoading, error } = useOpenApiStore();

	return useMemo(() => {
		if (isLoading) {
			return {
				collections: [],
				totalEndpoints: 0,
				isLoading: true,
				error: null,
				specInfo: null,
			};
		}

		if (error) {
			return {
				collections: [],
				totalEndpoints: 0,
				isLoading: false,
				error: error,
				specInfo: null,
			};
		}

		if (!spec) {
			return {
				collections: [],
				totalEndpoints: 0,
				isLoading: false,
				error: "No specification loaded",
				specInfo: null,
			};
		}

		// Use pregenerated sidebar if available, otherwise generate from spec
		const collections = spec.sidebar || generateSidebarFromSpec(spec);
		const totalEndpoints = collections.reduce((total, collection) => {
			return (
				total +
				(collection.requests?.reduce((collectionTotal, request) => {
					return collectionTotal + (request.items ? request.items.length : 1);
				}, 0) || 0)
			);
		}, 0);

		return {
			collections,
			totalEndpoints,
			isLoading: false,
			error: null,
			specInfo: {
				title: spec.info.title,
				version: spec.info.version,
				serversCount: spec.servers?.length || 0,
			},
		};
	}, [spec, isLoading, error]);
};

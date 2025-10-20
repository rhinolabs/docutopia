import type {
	OpenApiDocument,
	OperationObject,
	PathItemObject,
} from "@/core/types";
import { useOpenApiStore } from "@/stores/openapi-store";
import type { RequestType } from "@/types/api/requests";
import type {
	SidebarCollection,
	SidebarRequestItem,
} from "@/types/components/sidebar";
import { slugifyOperation } from "@/utils/slugify-operation";
import { useMemo } from "react";

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

// Generate sidebar data from raw OpenAPI spec
const generateSidebarFromSpec = (
	spec: OpenApiDocument,
): SidebarCollection[] => {
	const tagGroups = new Map<string, Array<SidebarRequestItem>>();

	// Group operations by tags
	for (const [path, pathItem] of Object.entries(spec.paths || {})) {
		for (const [method, operation] of Object.entries(
			pathItem as PathItemObject,
		)) {
			if (typeof operation !== "object" || !operation) continue;
			const op = operation as OperationObject;

			// Get the first tag or use "Untagged"
			const tag = op.tags?.[0] || "Untagged";

			// Use same fallback logic as OpenApiService.findOperationBySlug
			const operationId =
				(op as OperationObject & { operationId?: string }).operationId ||
				op.summary ||
				path;
			const slug = slugifyOperation(operationId);

			// Create the sidebar request item
			const item: SidebarRequestItem = {
				name: op.summary || op.description || `${method.toUpperCase()} ${path}`,
				url: slug,
				requestType: method.toLowerCase() as RequestType,
			};

			// Group by tag
			if (!tagGroups.has(tag)) {
				tagGroups.set(tag, []);
			}
			tagGroups.get(tag)?.push(item);
		}
	}

	// Return SidebarCollection[] with the correct structure
	return [
		{
			collectionName: spec.info.title,
			requests: Array.from(tagGroups.entries()).map(([tagName, items]) => ({
				name: tagName,
				url: "#",
				items: items.sort((a, b) => a.name.localeCompare(b.name)),
			})),
		},
	];
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

		// Generate sidebar on-the-fly from the OpenAPI spec
		const collections = generateSidebarFromSpec(spec);
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

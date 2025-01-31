import type { OpenApiDocument } from "@/types/api/openapi";
import type { SidebarCollection } from "@/types/sidebar";
import { slugifyOperation } from "./slugify-operation";

export function transformOpenApiToSidebar(
	doc: OpenApiDocument,
): SidebarCollection[] {
	const groupedOperations = Object.entries(doc.paths).reduce(
		(acc, [path, methods]) => {
			Object.entries(methods).forEach(([method, operation]) => {
				const tag = operation.tags?.[0] || "Other";
				const group = acc.get(tag) || [];

				group.push({
					name: operation.summary || `${method.toUpperCase()} ${path}`,
					url: slugifyOperation(
						operation.operationId || operation.summary || path,
					),
					requestType: method.toUpperCase(),
				});

				acc.set(tag, group);
			});
			return acc;
		},
		new Map<
			string,
			Array<{ name: string; url: string; requestType: string }>
		>(),
	);

	return [
		{
			collectionName: doc.info.title,
			requests: Array.from(groupedOperations).map(([tagName, items]) => ({
				name: tagName,
				url: "#",
				items: items.sort((a, b) => a.name.localeCompare(b.name)),
			})),
		},
	];
}

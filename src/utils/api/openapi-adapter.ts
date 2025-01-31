import type { OpenApiDocument } from "@/types/api/openapi";
import type { SidebarCollection } from "@/types/components/sidebar";
import { slugifyOperation } from "../slugify-operation";

export function transformOpenApiToSidebar(
	doc: OpenApiDocument,
): SidebarCollection[] {
	const groupedOperations = Object.entries(doc.paths).reduce(
		(acc, [path, methods]) => {
			const operations = Object.entries(methods).flatMap(
				([method, operation]) => {
					const tag = operation.tags?.[0] || "Other";
					return {
						tag,
						item: {
							name: operation.summary || `${method.toUpperCase()} ${path}`,
							url: slugifyOperation(
								operation.operationId || operation.summary || path,
							),
							requestType: method.toUpperCase(),
						},
					};
				},
			);

			for (const { tag, item } of operations) {
				const group = acc.get(tag) || [];
				group.push(item);
				acc.set(tag, group);
			}
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

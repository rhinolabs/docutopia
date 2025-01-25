import type { OpenApiDocument, SchemaObject } from "@/types/api/openapi";

export const resolveRef = (
	ref: string,
	doc: OpenApiDocument,
): SchemaObject | null => {
	const parts = ref.split("/");

	if (
		parts.length >= 4 &&
		parts[1] === "components" &&
		parts[2] === "schemas"
	) {
		const schemaName = parts[3];
		return doc.components?.schemas?.[schemaName] || null;
	}
	return null;
};

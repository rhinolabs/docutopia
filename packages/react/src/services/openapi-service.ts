import type { EnhancedOperation, OpenApiDocument } from "@/core/types";
import { OpenApiError } from "@/core/types/errors";
import { slugifyOperation } from "@/utils/slugify-operation";

export class OpenApiService {
	async loadSpec(specPath: string): Promise<OpenApiDocument> {
		try {
			const response = await fetch(specPath);

			if (!response.ok) {
				throw new Error(`Failed to load spec: ${response.statusText}`);
			}

			const rawSpec = await response.json();
			return this.transformSpec(rawSpec);
		} catch (error) {
			throw new OpenApiError(
				`OpenAPI service error: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	private transformSpec(rawSpec: unknown): OpenApiDocument {
		if (!rawSpec || typeof rawSpec !== "object" || !("openapi" in rawSpec)) {
			throw new OpenApiError("Invalid OpenAPI specification");
		}
		return rawSpec as OpenApiDocument;
	}

	findOperationBySlug(
		spec: OpenApiDocument,
		slug: string,
		index = 0,
	): EnhancedOperation | null {
		let count = 0;

		for (const [path, pathItem] of Object.entries(spec.paths)) {
			for (const [method, operation] of Object.entries(pathItem)) {
				if (!operation) continue;

				const operationSlug = slugifyOperation(
					operation.operationId || operation.summary || path,
				);

				if (operationSlug === slug) {
					if (count === index) {
					return { ...operation, path, method: method.toUpperCase() };
					}
					count++;
				}
			}
		}
		return null;
	}
}

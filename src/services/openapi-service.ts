import type { OpenApiDocument, EnhancedOperation } from "@/core/types";
import { OpenApiError } from "@/core/types/errors";

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

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private transformSpec(rawSpec: any): OpenApiDocument {
		if (!rawSpec.openapi) {
			throw new OpenApiError("Invalid OpenAPI specification");
		}
		return rawSpec;
	}

	findOperationBySlug(
		spec: OpenApiDocument,
		slug: string,
	): EnhancedOperation | null {
		for (const [path, pathItem] of Object.entries(spec.paths)) {
			for (const [method, operation] of Object.entries(pathItem)) {
				if (!operation) continue;

				const operationSlug = this.generateSlug(
					operation.operationId || operation.summary || path,
				);

				if (operationSlug === slug) {
					return { ...operation, path, method: method.toUpperCase() };
				}
			}
		}
		return null;
	}

	private generateSlug(input: string): string {
		return input
			.toLowerCase()
			.replace(/[^\w\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.replace(/^-+/, "")
			.replace(/-+$/, "");
	}
}

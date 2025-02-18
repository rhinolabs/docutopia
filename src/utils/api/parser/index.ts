import type { OpenApiDocument } from "@/types/api/openapi";
import { OpenAPIParserError } from "./errors";
import { validateRequiredFields } from "./validators";
import OpenAPIProcessors from "./processors";

export class OpenAPIParser {
	private processors: OpenAPIProcessors | null = null;

	async parse(input: unknown): Promise<OpenApiDocument> {
		if (!input || typeof input !== "object") {
			throw new OpenAPIParserError("Input must be an object");
		}

		const doc = input as OpenApiDocument;

		validateRequiredFields(doc);

		this.processors = new OpenAPIProcessors(doc);

		await this.processDocument(doc);

		return doc;
	}

	private async processDocument(doc: OpenApiDocument) {
		if (!this.processors) {
			throw new OpenAPIParserError("Processors not initialized");
		}

		if (doc.components) {
			await this.processors.processComponents(doc.components);
		}

		await this.processors.processPaths(doc.paths);
	}
}

export const parser = new OpenAPIParser();

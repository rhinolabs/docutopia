import type {
	ComponentsObject,
	OpenApiDocument,
	ParameterOrRef,
	PathItemObject,
	RequestBodyOrRef,
	ResponsesObject,
	SchemaObject,
	SchemaOrRef,
} from "@/types/api/openapi";
import { OpenAPIParserError } from "./errors";
import { validatePathSyntax } from "./validators";
import { REQUEST_TYPES } from "@/types/api/requests";

export default class OpenAPIProcessors {
	private refCache: Map<string, unknown>;
	private document: OpenApiDocument;

	constructor(document: OpenApiDocument) {
		this.refCache = new Map();
		this.document = document;
	}

	async processPaths(paths: Record<string, PathItemObject>): Promise<void> {
		for (const [path, pathItem] of Object.entries(paths)) {
			validatePathSyntax(path);
			await this.processPathItem(pathItem);
		}
	}

	private async processPathItem(pathItem: PathItemObject): Promise<void> {
		for (const op of REQUEST_TYPES) {
			const operation = pathItem[op as keyof PathItemObject];
			if (operation) {
				if (operation.parameters) {
					await this.processParameters(operation.parameters);
				}
				if (operation.requestBody) {
					await this.processRequestBody(operation.requestBody);
				}
				if (operation.responses) {
					await this.processResponses(operation.responses);
				}
			}
		}
	}

	private async processParameters(parameters: ParameterOrRef[]): Promise<void> {
		for (const param of parameters) {
			if ("$ref" in param) {
				await this.resolveRef(param.$ref);
			} else {
				if (!param.name || !param.in) {
					throw new OpenAPIParserError(
						"Parameter missing required fields: name, in",
					);
				}

				if (param.schema) {
					await this.processSchema(param.schema);
				}
			}
		}
	}

	private async processRequestBody(
		requestBody: RequestBodyOrRef,
	): Promise<void> {
		if ("$ref" in requestBody) {
			await this.resolveRef(requestBody.$ref);
			return;
		}

		if (requestBody.content) {
			for (const mediaType of Object.values(requestBody.content)) {
				if (mediaType.schema) {
					await this.processSchema(mediaType.schema);
				}
			}
		}
	}

	private async processResponses(responses: ResponsesObject): Promise<void> {
		for (const [_statusCode, response] of Object.entries(responses)) {
			if ("$ref" in response) {
				await this.resolveRef(response.$ref);
			} else {
				if (response.content) {
					for (const mediaType of Object.values(response.content)) {
						if (mediaType.schema) {
							await this.processSchema(mediaType.schema);
						}
					}
				}
			}
		}
	}

	async processComponents(components: ComponentsObject): Promise<void> {
		if (components.schemas) {
			for (const [name, schema] of Object.entries(components.schemas)) {
				await this.processSchema(schema);
				this.refCache.set(`#/components/schemas/${name}`, schema);
			}
		}
	}

	async processSchema(schema: SchemaOrRef): Promise<SchemaObject> {
		if ("$ref" in schema && typeof schema.$ref === "string") {
			return this.resolveRef(schema.$ref) as Promise<SchemaObject>;
		}

		const realSchema = schema as SchemaObject;

		if (realSchema.type === "array" && realSchema.items) {
			await this.processSchema(realSchema.items);
		}

		if (realSchema.type === "object" && realSchema.properties) {
			for (const prop of Object.values(realSchema.properties)) {
				await this.processSchema(prop);
			}
		}

		return realSchema;
	}

	private async resolveRef(ref: string): Promise<unknown> {
		if (this.refCache.has(ref)) {
			return this.refCache.get(ref);
		}

		if (ref.startsWith("#/")) {
			const parts = ref.slice(2).split("/");
			let current: unknown = this.document;

			for (const part of parts) {
				if (current && typeof current === "object" && part in current) {
					current = (current as Record<string, unknown>)[part];
				} else {
					console.error("Error while resolving ref, current object:", current);
					throw new OpenAPIParserError(`Invalid reference: ${ref}`);
				}
			}

			if (current) {
				this.refCache.set(ref, current);
				return current;
			}
		}

		throw new OpenAPIParserError(`Unable to resolve reference: ${ref}`);
	}
}

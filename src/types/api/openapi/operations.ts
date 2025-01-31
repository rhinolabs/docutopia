import type { OpenApiDocument } from "./core";
import type { OperationObject } from "./paths";

export interface EnhancedOperation extends OperationObject {
	path: string;
	method: string;
	operationId?: string;
}

export interface ApiLoaderData {
	doc: OpenApiDocument;
	operation: EnhancedOperation;
}

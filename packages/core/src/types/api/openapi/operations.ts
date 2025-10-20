import type { OperationObject } from "./paths";

export interface EnhancedOperation extends OperationObject {
	path: string;
	method: string;
	operationId?: string;
}

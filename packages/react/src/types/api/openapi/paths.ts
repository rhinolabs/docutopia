import type { ParameterOrRef } from "./parameters";
import type { RequestBodyObject, ResponseObject } from "./responses";
import type { SecurityObject } from "./security";

export interface PathItemObject {
	get?: OperationObject;
	post?: OperationObject;
	put?: OperationObject;
	delete?: OperationObject;
	patch?: OperationObject;
}

export interface OperationObject {
	summary?: string;
	description?: string;
	tags?: string[];
	parameters?: ParameterOrRef[];
	requestBody?: RequestBodyObject;
	responses: {
		[statusCode: string]: ResponseObject;
	};
	security?: SecurityObject[];
}

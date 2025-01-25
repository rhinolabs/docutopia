export interface OpenApiDocument {
	openapi: string;
	info: InfoObject;
	servers?: ServerObject[];
	paths: Record<string, PathItemObject>;
	components: {
		schemas: {
			[schemaName: string]: SchemaObject;
		};
	};
}

export interface InfoObject {
	title: string;
	version: string;
	description?: string;
}

export interface ServerObject {
	url: string;
	description?: string;
}

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
}

export interface ParameterObject {
	name: string;
	in: "path" | "query" | "header" | "cookie" | "body" | "response";
	required?: boolean;
	schema?: SchemaObject;
	description?: string;
}

export interface RequestBodyObject {
	required?: boolean;
	description?: string;
	content: Record<string, MediaTypeObject>;
}

export interface ResponseObject {
	description: string;
	content?: Record<string, MediaTypeObject>;
}

export interface SchemaObject {
	type?: "object" | "array" | "string" | "number" | "boolean" | "integer";
	description?: string;
	default?: number | string;
	pattern?: string;
	minimum?: number;
	maximum?: number;
	minLength?: number;
	maxLength?: number;
	required?: string[];
	enum?: (string | number | boolean)[];
	properties?: Record<string, SchemaObject>;
	items?: SchemaObject;
}

export interface ReferenceObject {
	$ref: string;
}

export type SchemaOrRef = SchemaObject | ReferenceObject;

export type ParameterOrRef = ParameterObject | ReferenceObject;

export interface MediaTypeObject {
	schema?: SchemaOrRef;
}

export interface ResponseEntry {
	status: string;
	description: string;
	content?: {
		[mediaType: string]: MediaTypeObject;
	};
}

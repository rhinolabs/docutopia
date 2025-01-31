// Core document structure
export interface OpenApiDocument {
	openapi: string;
	info: InfoObject;
	servers?: ServerObject[];
	tags?: TagsObject[];
	paths: Record<string, PathItemObject>;
	components?: ComponentsObject;
}

// Component types
export interface InfoObject {
	title: string;
	version: string;
	description?: string;
}

export interface ServerObject {
	url: string;
	description?: string;
}

export interface TagsObject {
	name: string;
	description?: string;
}

export interface ComponentsObject {
	schemas?: Record<string, SchemaObject>;
}

// Path and operation types
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

// Parameter types
export type ParameterOrRef = ParameterObject | ReferenceObject;

export interface ParameterObject {
	name: string;
	in: "path" | "query" | "header" | "cookie" | "body" | "response";
	required?: boolean;
	schema?: SchemaOrRef;
	description?: string;
}

// Request/Response types
export interface RequestBodyObject {
	required?: boolean;
	content: Record<string, MediaTypeObject>;
	description?: string;
}

export interface ResponsesObject {
	[statusCode: string]: ResponseOrRef;
}

export type ResponseOrRef = ResponseObject | ReferenceObject;

export interface ResponseObject {
	description: string;
	content?: Record<string, MediaTypeObject>;
}

// Schema types
export type SchemaOrRef = SchemaObject | ReferenceObject;

export interface SchemaObject {
	type?: string;
	format?: string;
	description?: string;
	properties?: Record<string, SchemaOrRef>;
	items?: SchemaOrRef;
	required?: string[];
	enum?: (string | number | boolean)[];
	default?: number | string;
	pattern?: string;
	minimum?: number;
	maximum?: number;
	minLength?: number;
	maxLength?: number;
}

export interface ReferenceObject {
	$ref: string;
}

export interface MediaTypeObject {
	schema?: SchemaOrRef;
}

export interface EnhancedOperation extends OperationObject {
	path: string;
	method: string;
	operationId?: string;
}

export interface ApiLoaderData {
	doc: OpenApiDocument;
	operation: EnhancedOperation;
}

export interface ResponseEntry {
	status: string;
	description: string;
	content?: Record<string, MediaTypeObject>;
}

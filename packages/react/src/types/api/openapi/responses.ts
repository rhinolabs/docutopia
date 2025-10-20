import type { MediaTypeObject, ReferenceObject } from "./schemas";

export interface ResponsesObject {
	[statusCode: string]: ResponseOrRef;
}

export type ResponseOrRef = ResponseObject | ReferenceObject;

export interface ResponseObject {
	description: string;
	content?: Record<string, MediaTypeObject>;
}

export interface ResponseEntry {
	status: string;
	description: string;
	content?: Record<string, MediaTypeObject>;
}

export interface RequestBodyObject {
	required?: boolean;
	content: Record<string, MediaTypeObject>;
	description?: string;
}

export type RequestBodyOrRef = RequestBodyObject | ReferenceObject;

import type { PathItemObject } from "./paths";
import type { SchemaObject } from "./schemas";
import type { SecurityObject, SecuritySchemeObject } from "./security";

export interface OpenApiDocument {
	openapi: string;
	info: InfoObject;
	servers: ServerObject[];
	tags?: TagsObject[];
	paths: Record<string, PathItemObject>;
	security?: SecurityObject[];
	components?: ComponentsObject;
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

export interface TagsObject {
	name: string;
	description?: string;
}

export interface ComponentsObject {
	schemas?: Record<string, SchemaObject>;
	securitySchemes?: Record<string, SecuritySchemeObject>;
}

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
	example?:
		| number
		| string
		| boolean
		| object
		| Record<string, unknown>
		| Array<unknown>;
	pattern?: string;
	minimum?: number;
	maximum?: number;
	exclusiveMinimum?: boolean;
	exclusiveMaximum?: boolean;
	multipleOf?: number;
	nullable?: boolean;
	minLength?: number;
	maxLength?: number;
}

export interface ReferenceObject {
	$ref: string;
}

export interface MediaTypeObject {
	schema?: SchemaOrRef;
	examples?: Record<string, SchemaOrRef>;
}

export interface BaseField {
	name: string;
	type:
		| "string"
		| "number"
		| "boolean"
		| "integer"
		| "array"
		| "object"
	description?: string;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	minimum?: number;
	maximum?: number;
	pattern?: string;
	defaultValue?: string | number | boolean;
	options?: string[];
}

export interface PrimitiveField extends BaseField {
	type: "string" | "integer" | "boolean" | "number";
}

export type ArrayItem =
	| Omit<PrimitiveField, "name">
	| Omit<ObjectField, "name">;

export interface ArrayField extends BaseField {
	type: "array";
	items: ArrayItem;
}

export interface ObjectField extends BaseField {
	type: "object";
	properties: (PrimitiveField | ArrayField | ObjectField)[];
}

export type Field = PrimitiveField | ArrayField | ObjectField;

export interface ParamFieldProps {
	field: Field;
	readOnly?: boolean;
}

export interface BaseField {
	name: string;
	type:
		| "string"
		| "number"
		| "boolean"
		| "integer"
		| "array"
		| "object"
		| string;
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
	type: "string" | "integer" | "boolean" | "number" | string;
}

export interface ArrayField extends BaseField {
	type: "array";
	items: PrimitiveField | ObjectField;
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

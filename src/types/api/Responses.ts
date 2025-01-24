export type ApiResponse = {
	status: number;
	success: boolean;
	message?: string;
	schemaRef?: Schema;
};

export type ResponseSectionProps = {
	responses: ApiResponse[];
};

export interface SchemaProperty {
	type: "string" | "number" | "boolean" | "object" | "array";
	required?: boolean;
	items?: SchemaProperty;
}

export interface Schema {
	type: "object" | "array" | "string" | "number" | "boolean";
	required?: boolean;
	properties?: Record<string, SchemaProperty>;
}

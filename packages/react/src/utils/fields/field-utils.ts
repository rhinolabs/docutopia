import type { ParameterObject } from "@/types/api/openapi";
import { asSchemaObject } from "../type-guards";

export function getFieldType(field: ParameterObject): string {
	if (!field.schema) {
		return "Undefined Type";
	}

	const schema = asSchemaObject(field.schema);
	if (!schema) {
		return "Reference (unresolved)";
	}

	switch (schema.type) {
		case "array": {
			const items = asSchemaObject(schema.items);
			if (items?.type) {
				return `array of ${items.type} [ ]`;
			}
			return "array [ ]";
		}
		case "object":
			return "object { }";
		default:
			return schema.type || "Undefined Type";
	}
}

export function getFieldConstraints(field: ParameterObject): string | null {
	const constraints: string[] = [];

	const rangeCheck = (
		min: number | undefined,
		max: number | undefined,
		_type: string,
	) => {
		if (min !== undefined && max !== undefined) {
			return `${min} to ${max}`;
		}
		if (min !== undefined) {
			return `≥ ${min}`;
		}
		if (max !== undefined) {
			return `≤ ${max}`;
		}
		return null;
	};

	if (field.schema?.type === "string") {
		const lengthConstraint = rangeCheck(
			field.schema.minLength,
			field.schema.maxLength,
			"length",
		);
		if (lengthConstraint) constraints.push(`length ${lengthConstraint}`);
	} else if (field.schema?.type === "integer") {
		const valueConstraint = rangeCheck(
			field.schema.minimum,
			field.schema.maximum,
			"value",
		);
		if (valueConstraint) constraints.push(valueConstraint);
	}

	return constraints.length > 0 ? constraints.join(", ") : null;
}

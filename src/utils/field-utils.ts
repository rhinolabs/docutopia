import type { ParameterObject } from "@/types/api/openapi";

export function getFieldType(field: ParameterObject): string {
	switch (field.schema?.type) {
		case "array":
			if (
				"items" in field.schema &&
				field.schema.items &&
				field.schema.items.type
			) {
				return `array of ${field.schema.items.type} []`;
			}
			return "array []";
		case "object":
			return "object {}";
		default:
			return field.schema?.type || "Undefined Type";
	}
}

export function getFieldConstraints(field: ParameterObject): string | null {
	const constraints: string[] = [];

	const rangeCheck = (
		min: number | undefined,
		max: number | undefined,
		type: string,
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
			field.schema?.minLength,
			field.schema?.maxLength,
			"length",
		);

		if (lengthConstraint) constraints.push(`length ${lengthConstraint}`);
	} else if (field.schema?.type === "integer") {
		const valueConstraint = rangeCheck(
			field.schema?.minimum,
			field.schema?.maximum,
			"value",
		);
		if (valueConstraint) constraints.push(valueConstraint);
	}

	return constraints.length > 0 ? constraints.join(", ") : null;
}

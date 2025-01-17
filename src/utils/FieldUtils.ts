import type { Field } from "@/types/components/FieldTypes";

export function getFieldType(field: Field): string {
	switch (field.type) {
		case "array":
			if ("items" in field && field.items.type) {
				return `array of ${field.items.type} []`;
			}
			return "array []";
		case "object":
			return "object {}";
		default:
			return field.type;
	}
}

export function getFieldConstraints(field: Field): string | null {
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

	if (field.type === "string") {
		const lengthConstraint = rangeCheck(
			field.minLength,
			field.maxLength,
			"length",
		);
		if (lengthConstraint) constraints.push(`length ${lengthConstraint}`);
	} else if (field.type === "integer") {
		const valueConstraint = rangeCheck(field.minimum, field.maximum, "value");
		if (valueConstraint) constraints.push(valueConstraint);
	}

	return constraints.length > 0 ? constraints.join(", ") : null;
}

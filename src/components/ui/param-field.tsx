import { ArrayField, type Field, type ParamFieldProps } from "@/types/requests";
import { Input } from "@rhino-ui/ui";
import type React from "react";

const RenderField: React.FC<ParamFieldProps> = ({ field }) => {
	switch (field.type) {
		case "string":
			return (
				<div className="col-span-1">
					<Input
						id={`pathParam${field.name}`}
						className="border bg-white"
						type="text"
						minLength={field.minLength}
						maxLength={field.maxLength}
						pattern={field.pattern}
					></Input>
				</div>
			);
		case "integer":
			return (
				<div className="col-span-1">
					<Input
						id={`pathParam${field.name}`}
						className="border bg-white"
						type="number"
						min={field.minimum}
						max={field.maximum}
					></Input>
				</div>
			);
		case "array":
			return <div>array</div>;
		default:
			return null;
	}
};

function getFieldType(field: Field): string {
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

function getFieldConstraints(field: Field): string | null {
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

export const ParamField: React.FC<ParamFieldProps> = ({
	field,
	readOnly = false,
}) => {
	return (
		<>
			<div className="grid grid-cols-4 gap-4">
				<div className="col-span-3">
					<div className="text-sm mb-2">
						<span className="font-semibold mr-1">{field.name}</span>
						<span className="text-muted-foreground mr-1">
							{getFieldType(field)}
						</span>

						{field.required && (
							<span className="text-red-500 mr-1">required</span>
						)}

						{getFieldConstraints(field) && (
							<span className="text-muted-foreground mr-1">
								{getFieldConstraints(field)}
							</span>
						)}
					</div>
					{field.description && (
						<p className="text-sm font-medium">{field.description}</p>
					)}
				</div>
				{!readOnly && <RenderField field={field} />}
			</div>
		</>
	);
};

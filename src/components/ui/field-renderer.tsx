import type React from "react";
import { getFieldComponent } from "@/utils/fields/field-registry";
import type { ParameterObject } from "@/types/api/openapi";
import UnsupportedField from "./fields/unsupported-field";

interface RenderFieldProps {
	field: ParameterObject;
	readOnly?: boolean;
}

export const RenderField: React.FC<RenderFieldProps> = ({
	field,
	readOnly = false,
}) => {
	if (!field.schema) {
		console.warn(`Missing schema for field: ${field.name}`);
		return (
			<div className="text-muted-foreground">
				Missing schema for field: {field.name}
			</div>
		);
	}

	const FieldComponent = getFieldComponent(field.schema?.type || "");

	if (!FieldComponent) {
		console.warn(`Unsupported field type: ${field.schema?.type}`);
		return <UnsupportedField type={field.schema?.type || "unknown"} />;
	}

	return (
		<FieldComponent
			field={field.schema}
			name={field.name}
			readOnly={readOnly}
		/>
	);
};

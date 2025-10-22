import type { ParameterObject } from "@/types/api/openapi";
import { getFieldComponent } from "@/utils/fields/field-registry";
import type React from "react";
import UnsupportedField from "./fields/unsupported-field";

interface RenderFieldProps {
	field: ParameterObject;
	readOnly?: boolean;
	bodyPath?: (string | number)[];
}

export const RenderField: React.FC<RenderFieldProps> = ({
	field,
	readOnly = false,
	bodyPath = [],
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

	// Determine param type from field.in
	const paramType =
		field.in === "path" || field.in === "query" ? field.in : "body";

	return (
		<FieldComponent
			field={field.schema}
			name={field.name}
			readOnly={readOnly}
			paramType={paramType}
			bodyPath={bodyPath}
		/>
	);
};

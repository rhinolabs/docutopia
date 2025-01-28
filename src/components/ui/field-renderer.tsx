import type React from "react";
import { getFieldComponent } from "@/utils/field-registry";
import type { ParameterObject } from "@/types/api/openapi";
import UnsupportedField from "./fields/unsupported-field";

export const RenderField: React.FC<{ field: ParameterObject }> = ({
	field,
}) => {
	const FieldComponent = getFieldComponent(field.schema?.type || "");

	if (!FieldComponent) {
		console.warn(`Unsupported field type: ${field.schema?.type}`);
		return <UnsupportedField type={field.schema?.type || "unknown"} />;
	}

	if (!field.schema) {
		console.warn(`Missing schema for field: ${field.name}`);
		return (
			<div className="text-muted-foreground">
				Missing schema for field: {field.name}
			</div>
		);
	}

	return <FieldComponent field={field.schema} name={field.name} />;
};

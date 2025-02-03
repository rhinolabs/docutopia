import { DynamicFields } from "../dynamic-fields";
import type { SchemaObject } from "@/types/api/openapi";

interface ArrayFieldProps {
	field: SchemaObject;
}

export const ArrayField: React.FC<ArrayFieldProps> = ({ field }) => {
	if (field.items?.type === "string") {
		const options = (field.items.enum ?? []).map(String) as string[];
		const hasOptions = options.length > 0;

		return (
			<div className="col-span-4">
				<DynamicFields hasOptions={hasOptions} options={options} />
			</div>
		);
	}

	console.warn(
		"ArrayField: Unsupported field type or missing 'items' property.",
	);
	return null;
};

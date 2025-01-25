import { DynamicFields } from "../dynamic-fields";
import type { SchemaObject } from "@/types/api/openapi";

interface ArrayFieldProps {
	field: SchemaObject;
}

export const ArrayField: React.FC<ArrayFieldProps> = ({ field }) => {
	if ("items" in field) {
		if (field.items?.type === "string") {
			const options = field.items.enum ?? [];
			const hasOptions = options.length > 0;

			return (
				<div className="col-span-4">
					<DynamicFields hasOptions={hasOptions} options={options} />
				</div>
			);
		}
	}
	return null;
};

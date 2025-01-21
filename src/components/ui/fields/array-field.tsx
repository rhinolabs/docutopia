import type { Field } from "@/types/components/field-types";
import { DynamicFields } from "../dynamic-fields";

export const ArrayField: React.FC<{ field: Field }> = ({ field }) => {
	if ("items" in field) {
		if (field.items.type === "string") {
			const options = field.items.options ?? [];
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

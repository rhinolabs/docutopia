import {
	ArrayField,
	IntegerField,
	StringField,
	ObjectField,
} from "@/components/ui/fields";
import type { Field } from "@/types/components/FieldTypes";

export const RenderField: React.FC<{ field: Field }> = ({ field }) => {
	switch (field.type) {
		case "string":
			return <StringField field={field} />;
		case "integer":
			return <IntegerField field={field} />;
		case "array":
			return <ArrayField field={field} />;
		case "object":
			return <ObjectField field={field} />;
		default:
			return null;
	}
};

import {
	ArrayField,
	IntegerField,
	StringField,
	ObjectField,
} from "@/components/ui/fields";
import type { ParameterObject } from "@/types/api/openapi";

export const RenderField: React.FC<{ field: ParameterObject }> = ({
	field,
}) => {
	switch (field.schema?.type) {
		case "string":
			return <StringField field={field.schema} name={field.name} />;
		case "integer":
			return <IntegerField field={field.schema} name={field.name} />;
		case "array":
			return <ArrayField field={field.schema} />;
		case "object":
			return <ObjectField field={field.schema} name={field.name} />;
		default:
			return null;
	}
};

import type { ParamFieldProps } from "@/types/components/field-types";
import { getFieldConstraints, getFieldType } from "@/utils/fields/field-utils";
import { RenderField } from "../field-renderer";

const FieldMetadata: React.FC<{ field: ParamFieldProps["field"] }> = ({
	field,
}) => (
	<div className="text-sm">
		<span className="font-semibold mr-1">{field.name}</span>
		<span className="text-muted-foreground mr-1">{getFieldType(field)}</span>
		{field.required && <span className="text-red-500 mr-1">required</span>}
		{getFieldConstraints(field) && (
			<span className="text-muted-foreground mr-1">
				{getFieldConstraints(field)}
			</span>
		)}
		{field.schema?.default && (
			<span className="text-muted-foreground mr-1">
				Defaults to {field.schema.default}
			</span>
		)}
	</div>
);

export const ParamField: React.FC<ParamFieldProps> = ({
	field,
	readOnly = false,
}) => {
	return (
		<div className="grid grid-cols-4 gap-4 py-4 px-6">
			<div className="col-span-3">
				<FieldMetadata field={field} />

				{field.description && (
					<p className="text-sm font-medium mt-2">{field.description}</p>
				)}
			</div>
			{!readOnly && <RenderField field={field} />}
		</div>
	);
};

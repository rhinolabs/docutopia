import type { ParamFieldProps } from "@/types/components/field-types";
import { getFieldConstraints, getFieldType } from "@/utils/fields/field-utils";
import { RenderField } from "../field-renderer";

const FieldMetadata: React.FC<{ field: ParamFieldProps["field"] }> = ({
	field,
}) => (
	<div className="text-sm flex gap-1.5 items-center">
		<span className="text-base">{field.name}</span>
		<span className="text-muted-foreground ">{getFieldType(field)}</span>
		{field.required && <span className="text-red-400 ">required</span>}
		{getFieldConstraints(field) && (
			<span className="text-muted-foreground ">
				{getFieldConstraints(field)}
			</span>
		)}
		{field.schema?.default && (
			<span className="text-muted-foreground ">
				Defaults to {field.schema.default}
			</span>
		)}
	</div>
);

export const ParamField: React.FC<ParamFieldProps> = ({
	field,
	readOnly = false,
	bodyPath = [],
}) => {
	return (
		<div className="grid grid-cols-4 gap-4 py-3 pl-5 pr-3 place-content-center">
			<div className="col-span-4 lg:col-span-3 my-auto">
				<FieldMetadata field={field} />

				{field.description && (
					<p className="text-sm text-muted-foreground">{field.description}</p>
				)}
			</div>
			<RenderField field={field} readOnly={readOnly} bodyPath={bodyPath} />
		</div>
	);
};

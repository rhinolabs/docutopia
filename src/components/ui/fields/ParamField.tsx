import type { ParamFieldProps } from "@/types/components/FieldTypes";
import { getFieldConstraints, getFieldType } from "@/utils/fieldUtils";
import { RenderField } from "../FieldRenderer";

export const ParamField: React.FC<ParamFieldProps> = ({
	field,
	readOnly = false,
}) => {
	return (
		<div className="grid grid-cols-4 gap-4 py-4 px-6">
			<div className="col-span-3">
				<div className="text-sm mb-2">
					<span className="font-semibold mr-1">{field.name}</span>
					<span className="text-muted-foreground mr-1">
						{getFieldType(field)}
					</span>

					{field.required && (
						<span className="text-red-500 mr-1">required</span>
					)}

					{getFieldConstraints(field) && (
						<span className="text-muted-foreground mr-1">
							{getFieldConstraints(field)}
						</span>
					)}

					{field.defaultValue && (
						<span className="text-muted-foreground mr-1">
							Defaults to {field.defaultValue}
						</span>
					)}
				</div>
				{field.description && (
					<p className="text-sm font-medium">{field.description}</p>
				)}
			</div>
			{!readOnly && <RenderField field={field} />}
		</div>
	);
};

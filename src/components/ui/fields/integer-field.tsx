import type { SchemaObject } from "@/types/api/openapi";
import { Input } from "@rhinolabs/ui";

interface IntegerFieldProps {
	field: SchemaObject;
	name: string;
	readOnly?: boolean;
}

export const IntegerField: React.FC<IntegerFieldProps> = ({
	field,
	name,
	readOnly = false,
}) => {
	if (readOnly) {
		return;
	}

	return (
		<div className="col-span-4 lg:col-span-1 m-auto w-full">
			<Input
				id={`pathParam${name}`}
				className="border bg-white"
				type="number"
				min={field.minimum}
				max={field.maximum}
			/>
		</div>
	);
};

import type { SchemaObject } from "@/types/api/openapi";
import { Input } from "@rhino-ui/ui";

interface IntegerFieldProps {
	field: SchemaObject;
	name: string;
}

export const IntegerField: React.FC<IntegerFieldProps> = ({ field, name }) => {
	return (
		<div className="col-span-1 m-auto w-full">
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

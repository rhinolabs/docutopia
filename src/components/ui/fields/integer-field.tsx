import type { Field } from "@/types/components/field-types";
import { Input } from "@rhino-ui/ui";

export const IntegerField: React.FC<{ field: Field }> = ({ field }) => {
	return (
		<div className="col-span-1 m-auto w-full">
			<Input
				id={`pathParam${field.name}`}
				className="border bg-white"
				type="number"
				min={field.minimum}
				max={field.maximum}
			/>
		</div>
	);
};

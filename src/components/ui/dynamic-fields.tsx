import { Button } from "@rhino-ui/ui";
import { Plus } from "lucide-react";
import { useState } from "react";
import { StringCollapsible } from "./string-collapsible";

type DynamicFieldsProps = {
	hasOptions: boolean;
	options: string[];
};

export const DynamicFields: React.FC<DynamicFieldsProps> = ({
	hasOptions,
	options,
}) => {
	const [fields, setFields] = useState<
		{ id: number; hasOptions: boolean; options?: string[] }[]
	>([]);

	const addField = () => {
		setFields((prevFields) => [
			...prevFields,
			{ id: Date.now(), hasOptions, options },
		]);
	};

	const deleteField = (id: number) => {
		setFields((prevFields) => prevFields.filter((field) => field.id !== id));
	};

	return (
		<div>
			{fields.map(({ id, hasOptions, options }) => (
				<StringCollapsible
					key={id}
					id={id}
					onDelete={deleteField}
					hasOptions={hasOptions}
					options={options}
				/>
			))}
			<Button
				variant="outline"
				className="w-full rounded-lg justify-between h-[48px]"
				onClick={addField}
			>
				ADD STRING
				<Plus className="text-muted-foreground" />
			</Button>
		</div>
	);
};

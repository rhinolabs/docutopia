import type { SchemaObject } from "@/core/types";
import { useRequestParams } from "@/index";
import { Button, Input } from "@rhinolabs/ui";
import { Plus, Trash } from "lucide-react";
import { useState } from "react";

interface CustomObjectFieldProps {
	bodyPath: (string | number)[];
	field: SchemaObject;
	readOnly: boolean;
	name: string;
}

type field = {
	id: string;
	field: [string, string];
};
const CustomObjectField: React.FC<CustomObjectFieldProps> = ({ bodyPath }) => {
	const [fields, setFields] = useState<Array<field>>([]);
	const { updateBodyParam } = useRequestParams();

	const updateStore = (updatedFields: Array<field>) => {
		const obj: Record<string, string> = Object.fromEntries(
			updatedFields.map((f) => f.field),
		);
		updateBodyParam(bodyPath, obj);
	};

	return (
		<div className="p-2 border-t space-y-2">
			{fields.map(({ id, field: [key, value] }) => (
				<div
					className="flex justify-between items-center w-full cursor-pointer border rounded-lg px-2 py-2 gap-2"
					key={id}
				>
					<div className="flex gap-2 items-center">
						<Input
							className="border bg-input text-foreground lg:min-w-[200px]"
							placeholder="Key"
							type="text"
							value={key}
							onChange={(e) => {
								const newKey = e.target.value;
								setFields((prev) => {
									const updatedFields = prev.map((field) =>
										field.id === id
											? { ...field, field: [newKey, field.field[1]] }
											: field,
									) as field[];

									updateStore(updatedFields);

									return updatedFields;
								});
							}}
						/>
						<span>:</span>
						<Input
							className="border bg-input text-foreground lg:min-w-[300px]"
							placeholder="Value"
							type="text"
							value={value}
							onChange={(e) => {
								const newValue = e.target.value;
								setFields((prev) => {
									const updatedFields = prev.map((field) =>
										field.id === id
											? { ...field, field: [field.field[0], newValue] }
											: field,
									) as field[];

									updateStore(updatedFields);

									return updatedFields;
								});
							}}
						/>
					</div>
					<Button
						variant="ghost"
						size="sm"
						className="w-9 p-0 bg-transparent hover:bg-destructive group"
						onClick={() => {
							setFields((prev) => prev.filter((field) => field.id !== id));
						}}
					>
						<Trash className="h-4 w-4 text-muted-foreground group-hover:text-destructive-foreground" />
						<span className="sr-only">Delete</span>
					</Button>
				</div>
			))}
			<Button
				variant="secondary"
				className="w-full rounded-lg justify-center gap-2 h-[40px]"
				onClick={() => {
					// Add new empty field
					setFields((prev) => [
						...prev,
						{ id: Date.now().toString(), field: ["", ""] },
					]);
				}}
			>
				ADD FIELD
				<Plus />
			</Button>
		</div>
	);
};

export { CustomObjectField };

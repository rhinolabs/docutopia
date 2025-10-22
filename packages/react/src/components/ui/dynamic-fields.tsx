import { useRequestParamsStore } from "@/stores/request-params-store";
import { Button } from "@rhinolabs/ui";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { StringCollapsible } from "./string-collapsible";

type DynamicFieldsProps = {
	hasOptions: boolean;
	options: string[];
	bodyPath: (string | number)[];
};

interface Field {
	id: number;
	index: number;
}

export const DynamicFields: React.FC<DynamicFieldsProps> = ({
	hasOptions,
	options,
	bodyPath,
}) => {
	const [fields, setFields] = useState<Field[]>([]);
	const { params, updateBodyParam } = useRequestParamsStore();

	// Read current array values from store
	const currentArray = bodyPath.reduce<unknown>((obj, key) => {
		return obj && typeof obj === "object"
			? (obj as Record<string, unknown>)[key]
			: undefined;
	}, params.body);

	// Initialize fields from store values
	// biome-ignore lint/correctness/useExhaustiveDependencies: Only run on mount to initialize from store
	useEffect(() => {
		if (Array.isArray(currentArray) && currentArray.length > 0) {
			const initialFields = currentArray.map((_, index) => ({
				id: Date.now() + index,
				index,
			}));
			setFields(initialFields);
		}
	}, []); // Only on mount

	const addField = () => {
		const newIndex = fields.length;
		setFields((prevFields) => [
			...prevFields,
			{ id: Date.now(), index: newIndex },
		]);
	};

	const deleteField = (id: number) => {
		const fieldToDelete = fields.find((f) => f.id === id);
		if (!fieldToDelete) return;

		// Remove from state
		const newFields = fields
			.filter((field) => field.id !== id)
			.map((field, index) => ({ ...field, index })); // Re-index

		setFields(newFields);

		// Update store: rebuild array without the deleted item
		if (Array.isArray(currentArray)) {
			const newArray = currentArray.filter(
				(_, idx) => idx !== fieldToDelete.index,
			);
			// Update the entire array in the store
			updateBodyParam(bodyPath, newArray);
		}
	};

	return (
		<div>
			{fields.map(({ id, index }) => {
				// Get current value from store
				const value =
					Array.isArray(currentArray) && currentArray[index] !== undefined
						? String(currentArray[index])
						: "";

				return (
					<StringCollapsible
						key={id}
						id={id}
						index={index}
						onDelete={deleteField}
						hasOptions={hasOptions}
						options={options}
						bodyPath={bodyPath}
						value={value}
					/>
				);
			})}
			<Button
				variant="outline"
				className="w-full rounded-lg justify-between h-[40px]  bg-muted hover:bg-accent"
				onClick={addField}
			>
				ADD STRING
				<Plus className="text-muted-foreground" />
			</Button>
		</div>
	);
};

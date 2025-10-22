import { useRequestParamsStore } from "@/stores/request-params-store";
import type { SchemaObject } from "@/types/api/openapi";
import { Input } from "@rhinolabs/ui";
import { useEffect, useState } from "react";

interface IntegerFieldProps {
	field: SchemaObject;
	name: string;
	readOnly?: boolean;
	paramType?: "path" | "query" | "body";
	bodyPath?: (string | number)[];
}

export const IntegerField: React.FC<IntegerFieldProps> = ({
	field,
	name,
	readOnly = false,
	paramType = "body",
	bodyPath = [],
}) => {
	const { updatePathParam, updateQueryParam, updateBodyParam } =
		useRequestParamsStore();
	const [value, setValue] = useState<number | "">(
		(field.default as number) ?? "",
	);

	// Update store when value changes
	useEffect(() => {
		if (readOnly || value === "") return;

		const numValue = Number(value);
		if (paramType === "path") {
			updatePathParam(name, String(numValue));
		} else if (paramType === "query") {
			updateQueryParam(name, String(numValue));
		} else if (paramType === "body") {
			const path = bodyPath.length > 0 ? bodyPath : [name];
			updateBodyParam(path, numValue);
		}
	}, [
		value,
		paramType,
		name,
		bodyPath,
		updatePathParam,
		updateQueryParam,
		updateBodyParam,
		readOnly,
	]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value === "" ? "" : Number(e.target.value);
		setValue(newValue);
	};

	if (readOnly) {
		return null;
	}

	return (
		<div className="col-span-4 lg:col-span-1 m-auto w-full">
			<Input
				id={`param-${paramType}-${name}`}
				className="border bg-input text-foreground"
				type="number"
				value={value}
				onChange={handleChange}
				min={field.minimum}
				max={field.maximum}
				placeholder={field.example ? String(field.example) : undefined}
			/>
		</div>
	);
};

import { useRequestParams } from "@/contexts";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import type { SchemaObject } from "@/types/api/openapi";
import { Input } from "@rhinolabs/ui";
import { useState } from "react";
import { FieldErrorPopUp } from "../field-error-popup";

interface IntegerFieldProps {
	field: SchemaObject;
	name: string;
	readOnly?: boolean;
	required?: boolean;
	paramType?: "path" | "query" | "body";
	bodyPath?: (string | number)[];
}

export const IntegerField: React.FC<IntegerFieldProps> = ({
	field,
	name,
	readOnly = false,
	required = false,
	paramType = "body",
	bodyPath = [],
}) => {
	const { updatePathParam, updateQueryParam, updateBodyParam } =
		useRequestParams();
	const [value, setValue] = useState<string>(String(field.default ?? ""));
	const { error, validate, rules, inputClassName } = useFieldValidation(
		field,
		required,
	);

	// Update store when value changes
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (readOnly) return;
		const stringValue = e.target.value;
		setValue(stringValue);

		const numberValue = Number(stringValue);
		validate(numberValue);

		if (paramType === "path") {
			updatePathParam(name, stringValue);
		} else if (paramType === "query") {
			updateQueryParam(name, stringValue);
		} else if (paramType === "body") {
			const path = bodyPath.length > 0 ? bodyPath : [name];
			updateBodyParam(path, stringValue);
		}
	};

	if (readOnly) {
		return null;
	}

	return (
		<div className="col-span-4 lg:col-span-1 m-auto w-full relative">
			<Input
				id={`param-${paramType}-${name}`}
				className={`border bg-input text-foreground ${inputClassName}`}
				type="number"
				value={value}
				onChange={handleChange}
				min={field.minimum}
				max={field.maximum}
				placeholder={field.example ? String(field.example) : undefined}
			/>
			<FieldErrorPopUp error={error} rules={rules} />
		</div>
	);
};

import { useRequestParams } from "@/contexts";
import type { SchemaObject } from "@/types/api/openapi";
import { Select } from "@rhinolabs/ui";
import type React from "react";
import { useState } from "react";

interface BooleanFieldProps {
	field: SchemaObject;
	name: string;
	readOnly?: boolean;
	required?: boolean;
	paramType?: "path" | "query" | "body";
	bodyPath?: (string | number)[];
}

export const BooleanField: React.FC<BooleanFieldProps> = ({
	name,
	field,
	readOnly = false,
	required = false,
	paramType = "body",
	bodyPath = [],
}) => {
	const { params, updatePathParam, updateQueryParam, updateBodyParam } =
		useRequestParams();
	const [value, setValue] = useState<"true" | "false" | "_undefined_">(
		field.default ? (String(field.default) as "true" | "false") : "_undefined_",
	);

	// Get current value based on param type
	let currentValue: unknown;
	if (paramType === "path") {
		currentValue = params.path[name];
	} else if (paramType === "query") {
		currentValue = params.query[name];
	} else {
		// For body params, navigate the path
		const path = bodyPath.length > 0 ? bodyPath : [name];
		currentValue = path.reduce<unknown>((obj, key) => {
			return obj && typeof obj === "object"
				? (obj as Record<string, unknown>)[key]
				: undefined;
		}, params.body);
	}

	if (readOnly) {
		return null;
	}

	const handleChange = (newValue: "true" | "false" | "_undefined_") => {
		const parsedValue = newValue === "_undefined_" ? undefined : newValue;

		if (paramType === "path") {
			updatePathParam(name, parsedValue);
		} else if (paramType === "query") {
			updateQueryParam(name, parsedValue);
		} else {
			const path = bodyPath.length > 0 ? bodyPath : [name];
			updateBodyParam(path, parsedValue);
		}

		setValue(newValue);
	};

	return (
		<div className="flex items-center gap-2 my-auto">
			<Select value={value} onValueChange={handleChange}>
				<Select.Trigger
					className={`m-auto bg-input ${value === "_undefined_" ? "text-muted-foreground" : "text-foreground"}`}
				>
					<Select.Value placeholder="Select" />
				</Select.Trigger>
				<Select.Content>
					{!required && <Select.Item value="_undefined_">Select</Select.Item>}
					<Select.Item value="true">True</Select.Item>
					<Select.Item value="false">False</Select.Item>
				</Select.Content>
			</Select>
		</div>
	);
};

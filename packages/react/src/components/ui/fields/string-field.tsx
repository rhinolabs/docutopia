import { useRequestParams } from "@/contexts";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import type { SchemaObject } from "@/types/api/openapi";
import { Badge, Input, Select } from "@rhinolabs/ui";
import { useState } from "react";
import { FieldErrorPopUp } from "../field-error-popup";

interface StringFieldProps {
	schema: SchemaObject;
	name: string;
	required?: boolean;
	readOnly?: boolean;
	paramType?: "path" | "query" | "body";
	bodyPath?: (string | number)[];
}

const isEnumField = (field: SchemaObject): boolean =>
	Array.isArray(field.enum) && field.enum.length > 0;

export const StringField: React.FC<StringFieldProps> = ({
	schema,
	name,
	required = false,
	readOnly = false,
	paramType = "body",
	bodyPath = [],
}) => {
	const { updatePathParam, updateQueryParam, updateBodyParam } =
		useRequestParams();
	const [value, setValue] = useState<string>((schema.default as string) || "");
	const { rules, error, validate, inputClassName } = useFieldValidation(
		schema,
		required,
	);

	// Update store when value changes
	const handleChange = (newValue: string) => {
		if (readOnly) return;

		validate(newValue);
		if (paramType === "path") {
			updatePathParam(name, newValue);
		} else if (paramType === "query") {
			updateQueryParam(name, newValue);
		} else if (paramType === "body") {
			const path = bodyPath.length > 0 ? bodyPath : [name];
			updateBodyParam(path, newValue);
		}

		setValue(newValue);
	};

	if (readOnly && !isEnumField(schema)) {
		return null;
	}

	if (isEnumField(schema)) {
		if (readOnly) {
			return (
				<div
					className={`${(schema.enum?.length ?? 0) > 3 ? "flex flex-wrap col-start-1 col-end-5 row-span-2" : "col-span-4 flex flex-row-reverse my-auto"}`}
				>
					{schema.enum?.map((option) => {
						const optionStr = String(option);
						return (
							<Badge
								key={optionStr}
								variant="outline"
								className="h-6 text-muted-foreground font-normal m-1 rounded-sm bg-muted"
							>
								{optionStr}
							</Badge>
						);
					})}
				</div>
			);
		}

		return (
			<div className="col-span-4 lg:col-span-1 my-auto">
				<Select value={value} onValueChange={handleChange}>
					<Select.Trigger className="m-auto bg-input text-foreground">
						<Select.Value placeholder="Select" />
					</Select.Trigger>
					<Select.Content className="bg-card">
						<Select.Group>
							{schema.enum?.map((option) => {
								const optionStr = String(option);
								const key = `select-item-${optionStr.replace(" ", "-")}`;

								return (
									<Select.Item
										key={key}
										value={optionStr}
										className="text-foreground hover:bg-accent"
									>
										{option}
									</Select.Item>
								);
							})}
						</Select.Group>
					</Select.Content>
				</Select>
			</div>
		);
	}

	return (
		<div className="col-span-4 lg:col-span-1 my-auto relative">
			<Input
				id={`param-${paramType}-${name}`}
				className={`bg-input text-foreground m-auto ${inputClassName}`}
				type="text"
				value={value}
				onChange={(e) => handleChange(e.target.value)}
				minLength={schema.minLength}
				maxLength={schema.maxLength}
				pattern={schema.pattern}
				placeholder={schema.example as string}
			/>
			<FieldErrorPopUp rules={rules} error={error} />
		</div>
	);
};

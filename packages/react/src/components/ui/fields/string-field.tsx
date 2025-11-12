import { useRequestParams } from "@/contexts";
import type { SchemaObject } from "@/types/api/openapi";
import { Badge, Input, Select } from "@rhinolabs/ui";
import { useState } from "react";

interface StringFieldProps {
	field: SchemaObject;
	name: string;
	readOnly?: boolean;
	required?: boolean;
	paramType?: "path" | "query" | "body";
	bodyPath?: (string | number)[];
}

const isEnumField = (field: SchemaObject): boolean =>
	Array.isArray(field.enum) && field.enum.length > 0;

export const StringField: React.FC<StringFieldProps> = ({
	field,
	name,
	readOnly = false,
	required = false,
	paramType = "body",
	bodyPath = [],
}) => {
	const { updatePathParam, updateQueryParam, updateBodyParam } =
		useRequestParams();
	const [value, setValue] = useState<string>(
		field.default ? String(field.default) : "",
	);

	// Update store when value changes
	const handleChange = (newValue: string) => {
		if (readOnly) return;

		const parsedValue = newValue === "_undefined_" ? undefined : newValue;

		console.log(parsedValue);
		if (paramType === "path") {
			updatePathParam(name, parsedValue);
		} else if (paramType === "query") {
			updateQueryParam(name, parsedValue);
		} else if (paramType === "body") {
			const path = bodyPath.length > 0 ? bodyPath : [name];
			updateBodyParam(path, parsedValue);
		}

		setValue(newValue);
	};

	if (readOnly && !isEnumField(field)) {
		return null;
	}

	if (isEnumField(field)) {
		if (readOnly) {
			return (
				<div
					className={`${(field.enum?.length ?? 0) > 3 ? "flex flex-wrap col-start-1 col-end-5 row-span-2" : "col-span-4 flex flex-row-reverse my-auto"}`}
				>
					{field.enum?.map((option) => {
						const optionStr = String(option);
						return (
							<>
								<Badge
									key={optionStr}
									variant="outline"
									className="h-6 text-muted-foreground font-normal m-1 rounded-sm bg-muted"
								>
									{optionStr}
								</Badge>
							</>
						);
					})}
				</div>
			);
		}

		return (
			<div className="col-span-4 lg:col-span-1 my-auto flex items-center gap-1">
				<Select value={value} onValueChange={handleChange}>
					<Select.Trigger
						className={`m-auto bg-input ${value === "_undefined_" ? "text-muted-foreground" : "text-foreground"}`}
					>
						<Select.Value placeholder="Select" />
					</Select.Trigger>
					<Select.Content className="bg-card">
						<Select.Group>
							{!required && (
								<Select.Item
									value="_undefined_"
									className="text-muted-foreground hover:bg-accent"
								>
									Select
								</Select.Item>
							)}
							{field.enum?.map((option) => {
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
		<div className="col-span-4 lg:col-span-1 my-auto">
			<Input
				id={`param-${paramType}-${name}`}
				className="border bg-input text-foreground m-auto"
				type="text"
				value={value}
				onChange={(e) => handleChange(e.target.value)}
				minLength={field.minLength}
				maxLength={field.maxLength}
				pattern={field.pattern}
				placeholder={field.example as string}
			/>
		</div>
	);
};

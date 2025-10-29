import { useRequestParams } from "@/contexts";
import type { SchemaObject } from "@/types/api/openapi";
import { Badge, Input, Select } from "@rhinolabs/ui";
import { useEffect, useState } from "react";

interface StringFieldProps {
	field: SchemaObject;
	name: string;
	readOnly?: boolean;
	paramType?: "path" | "query" | "body";
	bodyPath?: (string | number)[];
}

const isEnumField = (field: SchemaObject): boolean =>
	Array.isArray(field.enum) && field.enum.length > 0;

export const StringField: React.FC<StringFieldProps> = ({
	field,
	name,
	readOnly = false,
	paramType = "body",
	bodyPath = [],
}) => {
	const { updatePathParam, updateQueryParam, updateBodyParam } =
		useRequestParams();
	const [value, setValue] = useState<string>((field.default as string) || "");

	// Update store when value changes
	useEffect(() => {
		if (readOnly) return;

		if (paramType === "path") {
			updatePathParam(name, value);
		} else if (paramType === "query") {
			updateQueryParam(name, value);
		} else if (paramType === "body") {
			const path = bodyPath.length > 0 ? bodyPath : [name];
			updateBodyParam(path, value);
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

	const handleChange = (newValue: string) => {
		setValue(newValue);
	};

	if (readOnly && !isEnumField(field)) {
		return null;
	}

	if (isEnumField(field)) {
		if (readOnly) {
			return (
				<div className="col-span-4 lg:col-span-1 flex flex-row-reverse my-auto">
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
			<div className="col-span-4 lg:col-span-1 my-auto">
				<Select value={value} onValueChange={handleChange}>
					<Select.Trigger className="m-auto bg-input text-foreground">
						<Select.Value placeholder="Select" />
					</Select.Trigger>
					<Select.Content className="bg-card">
						<Select.Group>
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

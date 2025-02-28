import type { SchemaObject } from "@/types/api/openapi";
import { Badge, Input, Select } from "@rhinolabs/ui";

interface StringFieldProps {
	field: SchemaObject;
	name: string;
	readOnly?: boolean;
}

const isEnumField = (field: SchemaObject): boolean =>
	Array.isArray(field.enum) && field.enum.length > 0;

export const StringField: React.FC<StringFieldProps> = ({
	field,
	name,
	readOnly = false,
}) => {
	if (readOnly && !isEnumField(field)) {
		return;
	}

	if (isEnumField(field)) {
		if (readOnly) {
			return (
				<div className="col-span-4 flex flex-wrap">
					{field.enum?.map((option) => {
						const optionStr = String(option);
						return (
							<Badge
								key={optionStr}
								variant="outline"
								className="h-6 text-muted font-normal m-1 rounded-sm bg-gray-100"
							>
								{optionStr}
							</Badge>
						);
					})}
				</div>
			);
		}

		return (
			<div className="col-span-4 lg:col-span-1">
				<Select>
					<Select.Trigger className="m-auto">
						<Select.Value placeholder="Select" />
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							{field.enum?.map((option) => {
								const optionStr = String(option);
								const key = `select-item-${optionStr.replace(" ", "-")}`;

								return (
									<Select.Item key={key} value={optionStr}>
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
		<div className="col-span-4 lg:col-span-1">
			<Input
				id={`pathParam${name}`}
				className="border bg-white m-auto"
				type="text"
				minLength={field.minLength}
				maxLength={field.maxLength}
				pattern={field.pattern}
			/>
		</div>
	);
};

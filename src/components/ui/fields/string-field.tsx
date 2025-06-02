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
			<div className="col-span-4 lg:col-span-1">
				<Select>
					<Select.Trigger className="m-auto bg-input border-border text-foreground">
						<Select.Value placeholder="Select" />
					</Select.Trigger>
					<Select.Content className="bg-input border-border">
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
		<div className="col-span-4 lg:col-span-1">
			<Input
				id={`pathParam${name}`}
				className="border border-border bg-input text-foreground m-auto"
				type="text"
				minLength={field.minLength}
				maxLength={field.maxLength}
				pattern={field.pattern}
			/>
		</div>
	);
};

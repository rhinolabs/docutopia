import type { SchemaObject } from "@/types/api/openapi";
import {
	Input,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@rhino-ui/ui";

interface StringFieldProps {
	field: SchemaObject;
	name: string;
}

const isEnumField = (field: SchemaObject): boolean =>
	Array.isArray(field.enum) && field.enum.length > 0;

export const StringField: React.FC<StringFieldProps> = ({ field, name }) => {
	if (isEnumField(field)) {
		return (
			<Select>
				<SelectTrigger className="m-auto">
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{field.enum?.map((option) => {
							const optionStr = String(option);
							const key = `select-item-${optionStr.replace(" ", "-")}`;

							return (
								<SelectItem key={key} value={optionStr}>
									{option}
								</SelectItem>
							);
						})}
					</SelectGroup>
				</SelectContent>
			</Select>
		);
	}

	return (
		<Input
			id={`pathParam${name}`}
			className="border bg-white m-auto"
			type="text"
			minLength={field.minLength}
			maxLength={field.maxLength}
			pattern={field.pattern}
		/>
	);
};

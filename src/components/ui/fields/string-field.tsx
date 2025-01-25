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

export const StringField: React.FC<StringFieldProps> = ({ field, name }) => {
	return field.enum && Array.isArray(field.enum) && field.enum.length > 0 ? (
		<Select>
			<SelectTrigger className="m-auto">
				<SelectValue placeholder="Select" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{field.enum.map((option) => {
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
	) : (
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

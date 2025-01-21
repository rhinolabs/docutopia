import type { Field } from "@/types/components/FieldTypes";
import {
	Input,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@rhino-ui/ui";

export const StringField: React.FC<{ field: Field }> = ({ field }) => {
	return field.options &&
		Array.isArray(field.options) &&
		field.options.length > 0 ? (
		<Select>
			<SelectTrigger className="m-auto">
				<SelectValue placeholder="Select" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{field.options.map((option) => (
						<SelectItem
							key={`select-item-${option.replace(" ", "-")}`}
							value={option}
						>
							{option}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	) : (
		<Input
			id={`pathParam${field.name}`}
			className="border bg-white m-auto"
			type="text"
			minLength={field.minLength}
			maxLength={field.maxLength}
			pattern={field.pattern}
		/>
	);
};

import { useRequestParams } from "@/contexts";
import { Button, Input, Select } from "@rhinolabs/ui";
import { Trash } from "lucide-react";

type StringCollapsibleProps = {
	id: number;
	index: number;
	onDelete: (id: number) => void;
	hasOptions?: boolean;
	options?: string[];
	defaultOpen?: boolean;
	bodyPath: (string | number)[];
	value?: string;
};

export const StringCollapsible = ({
	id,
	index,
	onDelete,
	hasOptions = false,
	options = [],
	bodyPath,
	value = "",
}: StringCollapsibleProps) => {
	const { updateBodyParam } = useRequestParams();

	const handleChange = (newValue: string) => {
		// bodyPath already includes the array name, we just add the index
		updateBodyParam([...bodyPath, index], newValue);
	};

	return (
		<div className="flex justify-between items-center w-full cursor-pointer border rounded-lg px-2 py-2">
			<div>
				{hasOptions && options.length > 0 ? (
					<Select value={value} onValueChange={handleChange}>
						<Select.Trigger className="bg-card  text-foreground">
							<Select.Value placeholder="Select" />
						</Select.Trigger>
						<Select.Content className="bg-card ">
							<Select.Group>
								{options.map((option) => (
									<Select.Item
										key={`option-${encodeURIComponent(option)}`}
										value={option}
										className="text-foreground hover:bg-accent"
									>
										{option}
									</Select.Item>
								))}
							</Select.Group>
						</Select.Content>
					</Select>
				) : hasOptions ? (
					<p className="text-muted-foreground">No options Available</p>
				) : (
					<div>
						<Input
							id={`input-${id}`}
							className="border bg-input text-foreground min-w-[300px]"
							placeholder="String..."
							type="text"
							value={value}
							onChange={(e) => handleChange(e.target.value)}
						/>
					</div>
				)}
			</div>
			<div>
				<Button
					variant="ghost"
					size="sm"
					className="w-9 p-0 bg-transparent  hover:bg-destructive group"
					onClick={() => onDelete(id)}
				>
					<Trash className="h-4 w-4 text-muted-foreground group-hover:text-destructive-foreground" />
					<span className="sr-only">Delete</span>
				</Button>
			</div>
		</div>
	);
};

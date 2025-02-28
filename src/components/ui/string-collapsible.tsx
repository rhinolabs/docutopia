import { Button, Collapsible, Input, Select } from "@rhinolabs/ui";
import { Plus, Trash } from "lucide-react";
import { useState } from "react";

type StringCollapsibleProps = {
	id: number;
	onDelete: (id: number) => void;
	hasOptions?: boolean;
	options?: string[];
	defaultOpen?: boolean;
};

export const StringCollapsible = ({
	id,
	onDelete,
	hasOptions = false,
	options = [],
	defaultOpen = false,
}: StringCollapsibleProps) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	return (
		<Collapsible
			open={isOpen}
			onOpenChange={setIsOpen}
			className="border rounded-lg bg-white mb-4"
		>
			<div className="flex items-center justify-between space-x-4 pl-4 pr-2 py-2">
				<Collapsible.Trigger asChild>
					<div className="flex justify-between items-center w-full cursor-pointer">
						<h4 className="text-sm font-medium">STRING</h4>
						<div>
							<Button
								variant="ghost"
								size="sm"
								className="w-9 p-0"
								onClick={() => onDelete(id)}
							>
								<Trash className="h-4 w-4 text-destructive" />
								<span className="sr-only">Delete</span>
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="w-9 p-0"
								onClick={() => setIsOpen(!isOpen)}
							>
								<Plus className="h-4 w-4 text-muted-foreground" />
								<span className="sr-only">Toggle</span>
							</Button>
						</div>
					</div>
				</Collapsible.Trigger>
			</div>
			<Collapsible.Content>
				<div className="px-4 py-4 text-sm border-t">
					{hasOptions && options.length > 0 ? (
						<Select>
							<Select.Trigger>
								<Select.Value placeholder="Select" />
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									{options.map((option) => (
										<Select.Item
											key={`option-${encodeURIComponent(option)}`}
											value={option}
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
						<Input id={`input-${id}`} className="border bg-white" type="text" />
					)}
				</div>
			</Collapsible.Content>
		</Collapsible>
	);
};

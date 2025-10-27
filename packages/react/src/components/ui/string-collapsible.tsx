import { useRequestParamsStore } from "@/stores/request-params-store";
import { Button, Collapsible, Input, Select } from "@rhinolabs/ui";
import { ChevronRight, Trash } from "lucide-react";
import { useState } from "react";

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
	defaultOpen = false,
	bodyPath,
	value = "",
}: StringCollapsibleProps) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	const { updateBodyParam } = useRequestParamsStore();

	const handleChange = (newValue: string) => {
		// bodyPath already includes the array name, we just add the index
		updateBodyParam([...bodyPath, index], newValue);
	};

	return (
		<Collapsible
			open={isOpen}
			onOpenChange={setIsOpen}
			className="border  rounded-lg bg-card mb-4"
		>
			<div className="flex items-center justify-between space-x-4 pl-4 pr-2 py-2">
				<Collapsible.Trigger asChild>
					<div className="flex justify-between items-center w-full cursor-pointer">
						<h4 className="text-sm font-medium">STRING</h4>
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
							<Button
								variant="ghost"
								size="sm"
								className="w-9 p-0 bg-card"
								onClick={() => setIsOpen(!isOpen)}
							>
								<ChevronRight
									className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`}
								/>
								<span className="sr-only">Toggle</span>
							</Button>
						</div>
					</div>
				</Collapsible.Trigger>
			</div>
			<Collapsible.Content>
				<div className="px-4 py-4 text-sm border-t bg-background/50 overflow-hidden rounded-b-lg">
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
						<Input
							id={`input-${id}`}
							className="border bg-card text-foreground"
							type="text"
							value={value}
							onChange={(e) => handleChange(e.target.value)}
						/>
					)}
				</div>
			</Collapsible.Content>
		</Collapsible>
	);
};

import {
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Input,
} from "@rhino-ui/ui";
import { Plus, Trash } from "lucide-react";
import { useState } from "react";

const StringCollapsible = ({
	id,
	onDelete,
}: { id: number; onDelete: (id: number) => void }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Collapsible
			open={isOpen}
			onOpenChange={setIsOpen}
			className="border rounded-lg bg-white my-4"
		>
			<div className="flex items-center justify-between space-x-4 pl-4 pr-2 py-2">
				<CollapsibleTrigger asChild>
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
							<Button variant="ghost" size="sm" className="w-9 p-0">
								<Plus className="h-4 w-4 text-muted-foreground" />
								<span className="sr-only">Toggle</span>
							</Button>
						</div>
					</div>
				</CollapsibleTrigger>
			</div>
			<CollapsibleContent>
				<div className="px-4 py-4 text-sm border-t">
					<Input id="" className="border bg-white" type="text"></Input>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
};

export const DynamicFields = () => {
	const [fields, setFields] = useState<number[]>([]);

	const addField = () => {
		setFields((prevFields) => [...prevFields, Date.now()]);
	};

	const deleteField = (id: number) => {
		setFields((prevFields) => prevFields.filter((fieldId) => fieldId !== id));
	};

	return (
		<div>
			{fields.map((fieldId) => (
				<StringCollapsible key={fieldId} id={fieldId} onDelete={deleteField} />
			))}
			<Button
				variant="outline"
				className="w-full rounded-lg justify-between h-[48px]"
				onClick={addField}
			>
				ADD STRING
				<Plus className="text-muted-foreground" />
			</Button>
		</div>
	);
};

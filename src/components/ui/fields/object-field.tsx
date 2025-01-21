import type { Field } from "@/types/components/field-types";
import {
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@rhino-ui/ui";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ParamField } from "./param-field";

export const ObjectField: React.FC<{ field: Field }> = ({ field }) => {
	if ("properties" in field && field.properties.length > 0) {
		const [isOpen, setIsOpen] = useState(false);
		return (
			<div className="col-span-4">
				<Collapsible
					open={isOpen}
					onOpenChange={setIsOpen}
					className="border rounded-lg bg-white"
				>
					<div className="flex items-center justify-between space-x-4 px-4 py-2">
						<CollapsibleTrigger asChild>
							<div className="flex justify-between items-center w-full cursor-pointer">
								<h4 className="text-sm font-semibold">ENTITY OBJECT</h4>
								<Button variant="ghost" size="sm" className="w-9 p-0">
									<Plus className="h-4 w-4 text-muted-foreground" />
									<span className="sr-only">Toggle</span>
								</Button>
							</div>
						</CollapsibleTrigger>
					</div>
					<CollapsibleContent>
						{field.properties.map((subField) => (
							<>
								<hr key={`hr-${subField.type}`} />
								<ParamField key={`param-${subField.type}`} field={subField} />
							</>
						))}
					</CollapsibleContent>
				</Collapsible>
			</div>
		);
	}
	return null;
};

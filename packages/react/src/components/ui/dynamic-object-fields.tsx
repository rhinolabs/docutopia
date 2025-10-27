import { ParamField } from "@/components/ui/fields/param-field";
import { useRequestParamsStore } from "@/stores/request-params-store";
import type { SchemaObject } from "@/types/api/openapi";
import { asSchemaObject } from "@/utils/type-guards";
import { Button, Separator } from "@rhinolabs/ui";
import { ChevronRight, Plus, Trash } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface DynamicObjectFieldsProps {
	itemSchema: SchemaObject;
	bodyPath: (string | number)[];
}

interface ObjectItem {
	id: number;
	index: number;
}

export const DynamicObjectFields: React.FC<DynamicObjectFieldsProps> = ({
	itemSchema,
	bodyPath,
}) => {
	const [items, setItems] = useState<ObjectItem[]>([]);
	const [openItems, setOpenItems] = useState<Set<number>>(new Set());
	const initializedRef = useRef(false);

	console.log(
		"DynamicObjectFields render, items:",
		items.length,
		"openItems:",
		openItems.size,
	);

	// Initialize items from store values - only once on mount if store has data
	useEffect(() => {
		// Only initialize if we haven't initialized yet and don't have items
		if (!initializedRef.current && items.length === 0) {
			initializedRef.current = true;

			// Read from store without subscribing
			const bodyParams = useRequestParamsStore.getState().params.body;
			const currentArray = bodyPath.reduce<unknown>((obj, key) => {
				return obj && typeof obj === "object"
					? (obj as Record<string, unknown>)[key]
					: undefined;
			}, bodyParams);

			if (Array.isArray(currentArray) && currentArray.length > 0) {
				const initialItems = currentArray.map((_, index) => ({
					id: Date.now() + index,
					index,
				}));
				setItems(initialItems);
			}
		}
	}, [items.length, bodyPath]);

	const addItem = () => {
		const newIndex = items.length;
		const newItem = { id: Date.now(), index: newIndex };
		setItems((prev) => [...prev, newItem]);
		// Auto-expand newly added item
		setOpenItems((prev) => new Set([...prev, newItem.id]));
	};

	const deleteItem = (id: number) => {
		const itemToDelete = items.find((item) => item.id === id);
		if (!itemToDelete) return;

		// Remove from state and re-index
		const newItems = items
			.filter((item) => item.id !== id)
			.map((item, index) => ({ ...item, index }));

		setItems(newItems);
		setOpenItems((prev) => {
			const newSet = new Set(prev);
			newSet.delete(id);
			return newSet;
		});

		// Update store: remove the item from the array
		const { updateBodyParam, params } = useRequestParamsStore.getState();
		const currentArray = bodyPath.reduce<unknown>((obj, key) => {
			return obj && typeof obj === "object"
				? (obj as Record<string, unknown>)[key]
				: undefined;
		}, params.body);

		if (Array.isArray(currentArray)) {
			const newArray = currentArray.filter(
				(_, idx) => idx !== itemToDelete.index,
			);
			updateBodyParam(bodyPath, newArray);
		}
	};

	const toggleItem = (id: number) => {
		console.log("toggleItem called for id:", id);
		setOpenItems((prev) => {
			console.log("Previous openItems:", Array.from(prev));
			const newSet = new Set(prev);
			const hadId = newSet.has(id);
			if (hadId) {
				console.log("Removing id from set");
				newSet.delete(id);
			} else {
				console.log("Adding id to set");
				newSet.add(id);
			}
			console.log("New openItems:", Array.from(newSet));
			return newSet;
		});
	};

	const properties = itemSchema.properties || {};
	const requiredFields = itemSchema.required || [];

	return (
		<div className="space-y-3">
			{items.map(({ id, index }) => {
				const isOpen = openItems.has(id); // Controlled open state
				console.log(
					`Item ${index} has id ${id}, isOpen: ${isOpen}, openItems has:`,
					Array.from(openItems),
				);

				return (
					<div
						key={id}
						className="border rounded-lg bg-card mb-3 overflow-hidden"
					>
						<div className="flex items-center justify-between space-x-4 pl-4 pr-2 py-2">
							{/* <button
								type="button"
								className="flex justify-between items-center w-full cursor-pointer bg-transparent border-0 p-0 text-left"
								onClick={() => toggleItem(id)}
							> */}
							<h4 className="text-sm font-semibold">ITEM {index}</h4>
							<div>
								<Button
									variant="ghost"
									size="sm"
									className="w-9 p-0 bg-transparent hover:bg-destructive group"
									onClick={(e) => {
										e.stopPropagation();
										deleteItem(id);
									}}
								>
									<Trash className="h-4 w-4 group-hover:text-destructive-foreground" />
									<span className="sr-only">Delete</span>
								</Button>
								<Button
									variant="ghost"
									size="sm"
									className="w-9 p-0 bg-transparent"
									onClick={(e) => {
										e.stopPropagation();
										toggleItem(id);
									}}
								>
									<ChevronRight
										className={`h-4 w-4 text-muted-foreground transition-transform ${
											isOpen ? "rotate-90" : ""
										}`}
									/>
									<span className="sr-only">Toggle</span>
								</Button>
							</div>
							{/* </button> */}
						</div>
						{isOpen && (
							<div className="border-t bg-background/50">
								{Object.entries(properties).map(
									([propertyKey, propertySchemaOrRef], propIndex) => {
										const propSchema = asSchemaObject(propertySchemaOrRef);
										if (!propSchema) return null;

										// Construct bodyPath for this specific property: [...arrayPath, index, propertyKey]
										const propertyBodyPath = [...bodyPath, index, propertyKey];

										return (
											<React.Fragment key={propertyKey}>
												{propIndex > 0 && <Separator />}
												<ParamField
													field={{
														name: propertyKey,
														in: "body",
														required: requiredFields.includes(propertyKey),
														schema: propSchema,
														description: propSchema.description || "",
													}}
													readOnly={false}
													bodyPath={propertyBodyPath as string[]}
												/>
											</React.Fragment>
										);
									},
								)}
							</div>
						)}
					</div>
				);
			})}

			<Button
				variant="secondary"
				className="w-full rounded-lg justify-center gap-2 h-[40px]"
				onClick={addItem}
			>
				ADD ITEM
				<Plus />
			</Button>
		</div>
	);
};

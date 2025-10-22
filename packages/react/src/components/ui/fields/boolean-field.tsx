import { useRequestParamsStore } from "@/stores/request-params-store";
import type { SchemaObject } from "@/types/api/openapi";
import { Switch } from "@rhinolabs/ui";
import type React from "react";

interface BooleanFieldProps {
	field: SchemaObject;
	name: string;
	readOnly?: boolean;
	paramType?: "path" | "query" | "body";
	bodyPath?: string[];
}

export const BooleanField: React.FC<BooleanFieldProps> = ({
	name,
	readOnly = false,
	paramType = "body",
	bodyPath = [],
}) => {
	const { params, updatePathParam, updateQueryParam, updateBodyParam } =
		useRequestParamsStore();

	// Get current value based on param type
	let currentValue: unknown;
	if (paramType === "path") {
		currentValue = params.path[name];
	} else if (paramType === "query") {
		currentValue = params.query[name];
	} else {
		// For body params, navigate the path
		const path = bodyPath.length > 0 ? bodyPath : [name];
		currentValue = path.reduce<unknown>((obj, key) => {
			return obj && typeof obj === "object"
				? (obj as Record<string, unknown>)[key]
				: undefined;
		}, params.body);
	}

	const boolValue = currentValue === "true" || currentValue === true;

	if (readOnly) {
		return null;
	}

	const handleChange = (checked: boolean) => {
		if (paramType === "path") {
			updatePathParam(name, checked);
		} else if (paramType === "query") {
			updateQueryParam(name, checked);
		} else {
			const path = bodyPath.length > 0 ? bodyPath : [name];
			updateBodyParam(path, checked);
		}
	};

	return (
		<div className="flex items-center gap-2">
			<Switch
				id={`${paramType}-${name}`}
				checked={boolValue}
				onCheckedChange={handleChange}
				disabled={readOnly}
			/>
			<label
				htmlFor={`${paramType}-${name}`}
				className="text-sm text-muted-foreground"
			>
				{boolValue ? "true" : "false"}
			</label>
		</div>
	);
};

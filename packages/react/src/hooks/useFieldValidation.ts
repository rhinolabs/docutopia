import type { SchemaObject } from "@/core/types";
import { fieldToZodSchema } from "@/utils/fields/field-to-schema";
import { useState } from "react";
import type { $ZodIssue } from "zod/v4/core";

export const useFieldValidation = (field: SchemaObject, required?: boolean) => {
	const [error, setError] = useState<$ZodIssue[]>([]);
	const { schema, rules } = fieldToZodSchema(field, required);

	const validate = (value: unknown) => {
		if (schema) {
			const result = schema.safeParse(value);
			if (!result.success) {
				setError(result.error.issues);
			} else {
				setError([]);
			}
		}
	};

	return {
		schema,
		rules,
		error,
		validate,
		inputClassName: `peer ${error.length > 0 ? "border-red-600! bg-red-600/20" : ""}`,
	};
};

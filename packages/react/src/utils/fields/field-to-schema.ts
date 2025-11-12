import type { SchemaObject } from "@/core/types";
import z from "zod";

export function fieldToZodSchema(field: SchemaObject, required = false) {
	if (field.type === "string") {
		return stringFieldToZodSchema(field, required);
	}

	if (field.type === "number" || field.type === "integer") {
		return numberFieldToZodSchema(field, required);
	}

	throw new Error(`Unsupported field type validation: ${field.type}`);
}

export interface Rule {
	shortMessage: string;
	longMessage: string;
	rule: unknown;
}

export function stringFieldToZodSchema(field: SchemaObject, required = false) {
	if (field.enum !== undefined) {
		const rule = {
			shortMessage: `enum: ${field.enum.join(", ")}`,
			longMessage: `The value must be one of the following: ${field.enum.join(
				", ",
			)}.`,
			rule: field.enum,
		};

		return {
			schema: z.enum(
				field.enum.map((val) => String(val)) as [string, ...string[]],
				rule.longMessage,
			),
			rules: [rule] as Rule[],
		};
	}

	if (field.format !== undefined) {
		// Handle specific string formats if needed
		// For example, email, date-time, etc.
		if (field.format === "email") {
			const rule = {
				shortMessage: "format: email",
				longMessage: "The string must be a valid email address.",
				rule: "email",
			};

			return {
				schema: z.email(rule.longMessage),
				rules: [rule] as Rule[],
			};
		}
	}

	let schema = z.string();
	const rules: Rule[] = [
		{
			shortMessage: "Type: string",
			longMessage: "The value must be a string.",
			rule: "string",
		},
	];

	if (required) {
		const rule = {
			shortMessage: "Required",
			longMessage: "This field is required.",
			rule: "required",
		};
		schema = schema.nonempty(rule.longMessage);
		rules.push(rule);
	}

	if (field.minLength !== undefined) {
		const rule: Rule = {
			shortMessage: `MinLength: ${field.minLength}`,
			longMessage: `The length of the string must be at least ${field.minLength} characters.`,
			rule: field.minLength,
		};

		schema = schema.min(field.minLength, rule.longMessage);
		rules.push(rule);
	}

	if (field.maxLength !== undefined) {
		const rule: Rule = {
			shortMessage: `MaxLength: ${field.maxLength}`,
			longMessage: `The length of the string must be at most ${field.maxLength} characters.`,
			rule: field.maxLength,
		};

		schema = schema.max(field.maxLength, rule.longMessage);
		rules.push(rule);
	}

	if (field.pattern !== undefined) {
		const rule: Rule = {
			shortMessage: `Pattern: ${field.pattern}`,
			longMessage: `The string must match the pattern ${field.pattern}.`,
			rule: field.pattern,
		};
		schema = schema.regex(new RegExp(field.pattern), rule.longMessage);
		rules.push(rule);
	}

	if (field.nullable) {
		return { schema: schema.nullable(), rules };
	}

	if (!required) {
		return { schema: schema.optional(), rules };
	}

	return { schema, rules };
}

export function numberFieldToZodSchema(field: SchemaObject, required = false) {
	let schema: z.ZodNumber;
	const rules: Rule[] = [];

	if (field.type === "integer") {
		const rule: Rule = {
			shortMessage: "Type: integer",
			longMessage: "The value must be an integer.",
			rule: "integer",
		};
		rules.push(rule);
		schema = z.int(rule.longMessage);
	} else {
		const rule: Rule = {
			shortMessage: "Type: number",
			longMessage: "The value must be a number.",
			rule: "number",
		};
		rules.push(rule);
		schema = z.number(rule.longMessage);
	}

	if (required) {
		const rule: Rule = {
			shortMessage: "Required",
			longMessage: "This field is required.",
			rule: "required",
		};
		rules.push(rule);
	}

	if (field.minimum !== undefined) {
		if (field.exclusiveMinimum) {
			const rule: Rule = {
				shortMessage: `Greather: ${field.minimum}`,
				longMessage: `The value must be greater than ${field.minimum}.`,
				rule: field.minimum,
			};
			rules.push(rule);
			schema = schema.gt(field.minimum, rule.longMessage);
		} else {
			const rule: Rule = {
				shortMessage: `Greather or equal: ${field.minimum}`,
				longMessage: `The value must be greater than or equal to ${field.minimum}.`,
				rule: field.minimum,
			};
			rules.push(rule);
			schema = schema.gte(field.minimum, rule.longMessage);
		}
	}

	if (field.maximum !== undefined) {
		if (field.exclusiveMaximum) {
			const rule: Rule = {
				shortMessage: `Less: ${field.maximum}`,
				longMessage: `The value must be less than ${field.maximum}.`,
				rule: field.maximum,
			};
			rules.push(rule);
			schema = schema.lt(field.maximum, rule.longMessage);
		} else {
			const rule: Rule = {
				shortMessage: `Less or equal: ${field.maximum}`,
				longMessage: `The value must be less than or equal to ${field.maximum}.`,
				rule: field.maximum,
			};
			rules.push(rule);
			schema = schema.lte(field.maximum, rule.longMessage);
		}
	}

	if (field.multipleOf !== undefined) {
		const rule: Rule = {
			shortMessage: `Multiple of: ${field.multipleOf}`,
			longMessage: `The value must be a multiple of ${field.multipleOf}.`,
			rule: field.multipleOf,
		};
		rules.push(rule);
		schema = schema.multipleOf(field.multipleOf, rule.longMessage);
	}

	if (required) {
		return { schema: schema.nonoptional(), rules };
	}

	return { schema, rules };
}

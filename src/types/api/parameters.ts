import type { Field } from "@/types/components/field-types";

export type ApiParameter = Field & {
	in: "path" | "query" | "body";
};

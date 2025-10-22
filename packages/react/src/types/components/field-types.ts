import type { ParameterObject } from "../api/openapi";

export interface ParamFieldProps {
	field: ParameterObject;
	readOnly?: boolean;
	bodyPath?: (string | number)[];
}

import { Params } from "@/components/ui/params-handler";
import type { ParameterObject } from "@/types/api/openapi";

interface QueryParamsProps {
	queryParams: ParameterObject[];
}

export const QueryParams: React.FC<QueryParamsProps> = ({ queryParams }) => {
	return <Params title="QUERY PARAMS" params={queryParams} />;
};

import type { PrimitiveField } from "@/types/components/field-types";
import { Params } from "@/components/ui/params-handler";

interface QueryParamsProps {
	queryParams: PrimitiveField[];
}

export const QueryParams: React.FC<QueryParamsProps> = ({ queryParams }) => {
	return <Params title="QUERY PARAMS" params={queryParams} />;
};

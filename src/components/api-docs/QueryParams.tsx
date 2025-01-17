import type { PrimitiveField } from "@/types/components/FieldTypes";
import { Params } from "@/components/ui/ParamsHandler";

interface QueryParamsProps {
	queryParams: PrimitiveField[];
}

export const QueryParams: React.FC<QueryParamsProps> = ({ queryParams }) => {
	return <Params title="QUERY PARAMS" params={queryParams} />;
};

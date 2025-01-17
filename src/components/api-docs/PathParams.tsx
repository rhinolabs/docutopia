import type { PrimitiveField } from "@/types/components/FieldTypes";
import { Params } from "@/components/ui/ParamsHandler";

interface PathParamsProps {
	pathParams: PrimitiveField[];
}

export const PathParams: React.FC<PathParamsProps> = ({ pathParams }) => {
	return <Params title="PATH PARAMS" params={pathParams} />;
};

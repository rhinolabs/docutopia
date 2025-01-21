import type { PrimitiveField } from "@/types/components/field-types";
import { Params } from "@/components/ui/params-handler";

interface PathParamsProps {
	pathParams: PrimitiveField[];
}

export const PathParams: React.FC<PathParamsProps> = ({ pathParams }) => {
	return <Params title="PATH PARAMS" params={pathParams} />;
};

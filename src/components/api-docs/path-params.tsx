import { Params } from "@/components/ui/params-handler";
import type { ParameterObject } from "@/types/api/openapi";

interface PathParamsProps {
	pathParams: ParameterObject[];
}

export const PathParams: React.FC<PathParamsProps> = ({ pathParams }) => {
	return <Params title="PATH PARAMS" params={pathParams} />;
};

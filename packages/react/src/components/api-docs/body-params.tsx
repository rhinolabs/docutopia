import { Params } from "@/components/ui/params-handler";
import type { ParameterObject } from "@/types/api/openapi";

interface BodyParamsProps {
	bodyParams: ParameterObject[];
}

export const BodyParams: React.FC<BodyParamsProps> = ({ bodyParams }) => {
	return <Params title="BODY PARAMS" params={bodyParams} />;
};

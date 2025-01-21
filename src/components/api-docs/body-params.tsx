import type { PrimitiveField } from "@/types/components/field-types";
import { Params } from "@/components/ui/params-handler";

interface BodyParamsProps {
	bodyParams: PrimitiveField[];
}

export const BodyParams: React.FC<BodyParamsProps> = ({ bodyParams }) => {
	return <Params title="BODY PARAMS" params={bodyParams} />;
};

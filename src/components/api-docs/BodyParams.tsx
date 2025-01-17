import type { PrimitiveField } from "@/types/components/FieldTypes";
import { Params } from "@/components/ui/ParamsHandler";

interface BodyParamsProps {
	bodyParams: PrimitiveField[];
}

export const BodyParams: React.FC<BodyParamsProps> = ({ bodyParams }) => {
	return <Params title="BODY PARAMS" params={bodyParams} />;
};

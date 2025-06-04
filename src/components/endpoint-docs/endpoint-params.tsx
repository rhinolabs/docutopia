import type React from "react";
import { PathParams } from "@/components/api-docs/path-params";
import { QueryParams } from "@/components/api-docs/query-params";
import { BodyParams } from "@/components/api-docs/body-params";
import { useEndpointParameter } from "@/hooks/use-endpoint-parameter";
import type { ParameterObject } from "@/core/types";

interface EndpointParametersProps {
	parameters: { pathParams: ParameterObject[]; queryParams: ParameterObject[] };
	bodyParams: ParameterObject[];
}

export const EndpointParams: React.FC<EndpointParametersProps> = ({
	parameters,
	bodyParams,
}) => {
	const {
		pathParams,
		queryParams,
		bodyParams: processedBodyParams,
		hasParameters,
	} = useEndpointParameter(parameters, bodyParams);

	if (!hasParameters) {
		return null;
	}

	return (
		<div className="parameters-section">
			{pathParams.length > 0 && <PathParams pathParams={pathParams} />}
			{queryParams.length > 0 && <QueryParams queryParams={queryParams} />}
			{processedBodyParams.length > 0 && (
				<BodyParams bodyParams={processedBodyParams} />
			)}
		</div>
	);
};

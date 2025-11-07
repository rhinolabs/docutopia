import type { EnhancedOperation, ParameterObject } from "@/core/types";
import { memo } from "react";
import { EndpointHeader } from "./endpoint-header";
import { EndpointParams } from "./endpoint-params";
import { EndpointResponses } from "./endpoint-responses";

interface EndpointDocumentationProps {
	operation: EnhancedOperation;
	parameters: { pathParams: ParameterObject[]; queryParams: ParameterObject[] };
	bodyParams: ParameterObject[];
}

export const EndpointDocumentation = memo<EndpointDocumentationProps>(
	({ operation, parameters, bodyParams }) => {
		return (
			<div className="xl:col-span-13 lg:col-span-3 ">
				<EndpointHeader operation={operation} />
				<EndpointParams parameters={parameters} bodyParams={bodyParams} />
				<EndpointResponses operation={operation} />
			</div>
		);
	},
);

EndpointDocumentation.displayName = "EndpointDocumentation";

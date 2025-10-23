import type { EnhancedOperation, ParameterObject } from "@/core/types";
import { memo } from "react";
import { EndpointHeader } from "./endpoint-header.tsx";
import { EndpointParams } from "./endpoint-params.tsx";
import { EndpointResponses } from "./endpoint-responses.tsx";

interface EndpointDocumentationProps {
	operation: EnhancedOperation;
	parameters: { pathParams: ParameterObject[]; queryParams: ParameterObject[] };
	bodyParams: ParameterObject[];
}

export const EndpointDocumentation = memo<EndpointDocumentationProps>(
	({ operation, parameters, bodyParams }) => {
		return (
			<div className="lg:col-span-13 pl-5 pr-3">
				<EndpointHeader operation={operation} />
				<div className="content">
					<EndpointParams parameters={parameters} bodyParams={bodyParams} />
					<EndpointResponses operation={operation} />
				</div>
			</div>
		);
	},
);

EndpointDocumentation.displayName = "EndpointDocumentation";

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
			<div className="lg:col-span-13 lg:pl-5 lg:pr-3">
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

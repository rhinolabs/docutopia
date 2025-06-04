import { memo } from "react";
import { EndpointHeader } from "./EndpointHeader";
import { EndpointParameters } from "./EndpointParameters";
import { EndpointResponses } from "./EndpointResponses";
import type { EnhancedOperation, ParameterObject } from "@/core/types";

interface EndpointDocumentationProps {
	operation: EnhancedOperation;
	parameters: { pathParams: ParameterObject[]; queryParams: ParameterObject[] };
	bodyParams: ParameterObject[];
}

export const EndpointDocumentation = memo<EndpointDocumentationProps>(
	({ operation, parameters, bodyParams }) => {
		return (
			<div className="lg:col-span-2">
				<EndpointHeader operation={operation} />
				<div className="content">
					<EndpointParameters parameters={parameters} bodyParams={bodyParams} />
					<EndpointResponses operation={operation} />
				</div>
			</div>
		);
	},
);

EndpointDocumentation.displayName = "EndpointDocumentation";

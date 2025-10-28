import { ResponseTypes } from "@/components/api-docs/api-response";
import type { EnhancedOperation } from "@/core/types";
import { useOpenAPI } from "@/contexts";
import { useEndpointResponses } from "@/hooks/use-endpoint-responses";
import type React from "react";

interface EndpointResponsesProps {
	operation: EnhancedOperation;
}

export const EndpointResponses: React.FC<EndpointResponsesProps> = ({
	operation,
}) => {
	const { spec } = useOpenAPI();
	const { responses, hasResponses } = useEndpointResponses(operation);

	if (!hasResponses) {
		return null;
	}

	return (
		<div className="responses-section">
			<ResponseTypes responses={responses} doc={spec} />
		</div>
	);
};

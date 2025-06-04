import type React from "react";
import { ResponseTypes } from "@/components/api-docs/api-response";
import { useEndpointResponses } from "@/hooks/use-endpoint-responses";
import { useOpenApiStore } from "@/stores/openapi-store";
import type { EnhancedOperation } from "@/core/types";

interface EndpointResponsesProps {
	operation: EnhancedOperation;
}

export const EndpointResponses: React.FC<EndpointResponsesProps> = ({
	operation,
}) => {
	const { spec } = useOpenApiStore();
	const { responses, hasResponses } = useEndpointResponses(operation);

	if (!hasResponses || !spec) {
		return null;
	}

	return (
		<div className="responses-section">
			<ResponseTypes responses={responses} doc={spec} />
		</div>
	);
};

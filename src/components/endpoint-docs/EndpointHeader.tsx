import type React from "react";
import { Badge, Separator, Sidebar } from "@rhinolabs/ui";
import { useEndpointHeader } from "@/hooks/useEndpointHeader";
import type { EnhancedOperation } from "@/core/types";

interface EndpointHeaderProps {
	operation: EnhancedOperation;
}

export const EndpointHeader: React.FC<EndpointHeaderProps> = ({
	operation,
}) => {
	const { title, method, methodClass, fullUrl } = useEndpointHeader(operation);

	return (
		<div className="head">
			<Sidebar.Trigger className="pb-4" />
			<Separator />
			<h1 className="text-2xl font-semibold my-3">{title}</h1>
			<div className="text-xs text-muted-foreground flex items-center overflow-x-scroll">
				<Badge
					className={`${methodClass} text-white text-[10px] h-[17px] px-3 font-medium mr-3`}
				>
					{method}
				</Badge>
				{fullUrl}
			</div>
		</div>
	);
};

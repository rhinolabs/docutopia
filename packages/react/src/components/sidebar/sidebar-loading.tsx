import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Sidebar } from "@rhinolabs/ui";
import type React from "react";

export const SidebarLoading: React.FC = () => {
	return (
		<Sidebar.Header>
			<div className="p-4 flex items-center justify-center">
				<LoadingSpinner size="sm" message="Loading navigation..." />
			</div>
		</Sidebar.Header>
	);
};

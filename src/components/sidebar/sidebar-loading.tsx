import type React from "react";
import { Sidebar } from "@rhinolabs/ui";
import { LoadingSpinner } from "@/components/common/loading-spinner.tsx";

export const SidebarLoading: React.FC = () => {
	return (
		<Sidebar.Header>
			<div className="p-4 flex items-center justify-center">
				<LoadingSpinner size="sm" message="Loading navigation..." />
			</div>
		</Sidebar.Header>
	);
};

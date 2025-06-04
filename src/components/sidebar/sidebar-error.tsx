import type React from "react";
import { Sidebar } from "@rhinolabs/ui";
import { AlertCircle } from "lucide-react";

interface SidebarErrorProps {
	error: string;
}

export const SidebarError: React.FC<SidebarErrorProps> = ({ error }) => {
	return (
		<Sidebar.Header>
			<div className="p-4 flex items-center gap-2 text-red-500">
				<AlertCircle className="w-4 h-4" />
				<span className="text-sm">{error}</span>
			</div>
		</Sidebar.Header>
	);
};

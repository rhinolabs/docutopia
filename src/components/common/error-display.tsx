import type React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@rhinolabs/ui";

interface ErrorDisplayProps {
	error: string;
	onRetry?: () => void;
	title?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
	error,
	onRetry,
	title = "Something went wrong",
}) => {
	return (
		<div className="flex flex-col items-center justify-center p-8 text-center">
			<AlertCircle className="w-12 h-12 text-red-500 mb-4" />
			<h2 className="text-xl font-semibold mb-2">{title}</h2>
			<p className="text-muted-foreground mb-4 max-w-md">{error}</p>
			{onRetry && (
				<Button
					onClick={onRetry}
					variant="outline"
					className="flex items-center gap-2"
				>
					<RefreshCw className="w-4 h-4" />
					Try Again
				</Button>
			)}
		</div>
	);
};

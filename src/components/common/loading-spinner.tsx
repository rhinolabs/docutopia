import type React from "react";

interface LoadingSpinnerProps {
	message?: string;
	size?: "sm" | "md" | "lg";
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
	message = "Loading...",
	size = "md",
}) => {
	const sizeClasses = {
		sm: "w-4 h-4",
		md: "w-8 h-8",
		lg: "w-12 h-12",
	};

	return (
		<div className="flex flex-col items-center justify-center p-8">
			<div
				className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}
			/>
			{message && (
				<p className="mt-4 text-sm text-muted-foreground">{message}</p>
			)}
		</div>
	);
};

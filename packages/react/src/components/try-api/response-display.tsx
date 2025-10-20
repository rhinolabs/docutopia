import type { ApiResponse, EnhancedOperation } from "@/core/types";
import { Badge, Card, Tabs } from "@rhinolabs/ui";
import type React from "react";

interface ResponseDisplayProps {
	response: ApiResponse | null;
	error: string | null;
	operation: EnhancedOperation;
}

export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({
	response,
	error,
	operation,
}) => {
	const getStatusColor = (status: string) => {
		const statusNum = Number.parseInt(status);
		if (statusNum >= 200 && statusNum < 300) return "bg-green-500";
		if (statusNum >= 300 && statusNum < 400) return "bg-yellow-500";
		if (statusNum >= 400 && statusNum < 500) return "bg-orange-500";
		if (statusNum >= 500) return "bg-red-500";
		return "bg-gray-500";
	};

	const responseStatuses = operation.responses
		? Object.keys(operation.responses)
		: [];

	return (
		<Card className="border shadow-none rounded-lg bg-card">
			<Card.Header>
				<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
					RESPONSE
				</h3>
			</Card.Header>
			<Card.Content>
				{/* Response Status Options */}
				{responseStatuses.length > 0 && (
					<div className="flex flex-wrap gap-2 mb-4">
						{responseStatuses.map((status) => (
							<Badge
								key={status}
								className={`${getStatusColor(status)} text-white text-xs px-2 py-1`}
							>
								{status}
							</Badge>
						))}
					</div>
				)}

				{error ? (
					<div className="text-center py-8 text-red-500">Error: {error}</div>
				) : response ? (
					<Tabs defaultValue="response" className="w-full">
						<Tabs.List className="grid w-full grid-cols-2">
							<Tabs.Trigger value="response">Response</Tabs.Trigger>
							<Tabs.Trigger value="headers">Headers</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content value="response" className="mt-4">
							<div className="space-y-4">
								<div className="flex justify-center">
									<Badge
										className={`${getStatusColor(response.status.toString())} text-white`}
									>
										{response.status}
									</Badge>
								</div>
								<pre className="bg-input p-4 rounded-md text-sm font-mono overflow-x-auto text-foreground border max-h-64 overflow-y-auto">
									<code>{JSON.stringify(response.data, null, 2)}</code>
								</pre>
							</div>
						</Tabs.Content>
						<Tabs.Content value="headers" className="mt-4">
							<pre className="bg-input p-4 rounded-md text-sm font-mono overflow-x-auto text-foreground border">
								<code>{JSON.stringify(response.headers || {}, null, 2)}</code>
							</pre>
						</Tabs.Content>
					</Tabs>
				) : (
					<div className="text-center py-8 text-muted-foreground">
						<p>Click "Try It!" to start a request and see the response here!</p>
					</div>
				)}
			</Card.Content>
		</Card>
	);
};

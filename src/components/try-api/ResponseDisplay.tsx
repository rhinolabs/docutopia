import type React from "react";
import { Card } from "@rhinolabs/ui";
import type { ApiResponse } from "@/core/types";

interface ResponseDisplayProps {
	response: ApiResponse | null;
	error: string | null;
}

export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({
	response,
	error,
}) => {
	return (
		<Card className="border shadow-none rounded-lg bg-card">
			<Card.Header>
				<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
					RESPONSE
				</h3>
			</Card.Header>
			<Card.Content>
				{error ? (
					<div className="text-center py-8 text-red-500">Error: {error}</div>
				) : response ? (
					<div className="space-y-4">
						<div className="flex justify-center">
							<span
								className={`text-sm px-2 py-1 rounded ${
									response.status >= 200 && response.status < 300
										? "bg-green-100 text-green-800"
										: "bg-red-100 text-red-800"
								}`}
							>
								{response.status}
							</span>
						</div>
						<pre className="bg-input p-4 rounded-md text-sm font-mono overflow-x-auto text-foreground border">
							<code>{JSON.stringify(response.data, null, 2)}</code>
						</pre>
					</div>
				) : (
					<div className="text-center py-8 text-muted-foreground">
						<p>Click "Try It!" to start a request and see the response here!</p>
					</div>
				)}
			</Card.Content>
		</Card>
	);
};

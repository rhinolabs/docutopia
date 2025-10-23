import type { ApiResponse, EnhancedOperation } from "@/core/types";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import { Badge, Card, Tabs } from "@rhinolabs/ui";
import { type AnnotationHandler, InnerLine, Pre } from "codehike/code";
import type React from "react";

export const lineNumbers: AnnotationHandler = {
	name: "line-numbers",
	Line: (props) => {
		const width = props.totalLines.toString().length + 1;
		return (
			<div className="flex">
				<span
					className="text-right opacity-50 select-none"
					style={{ minWidth: `${width}ch` }}
				>
					{props.lineNumber}
				</span>
				<InnerLine merge={props} className="flex-1 pl-2" />
			</div>
		);
	},
};
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
	const highlightedData = useHighlightedCode(
		"json",
		response ? JSON.stringify(response.data, null, 2) : undefined,
	);
	const highlightedHeaders = useHighlightedCode(
		"json",
		response ? JSON.stringify(response.headers, null, 2) : undefined,
	);

	const getStatusColor = (status: string) => {
		const statusNum = Number.parseInt(status);
		if (statusNum >= 200 && statusNum < 300)
			return "border-green-500 text-green-500";
		if (statusNum >= 300 && statusNum < 400)
			return "border-yellow-500 text-yellow-500";
		if (statusNum >= 400 && statusNum < 500)
			return "border-orange-400 text-orange-400";
		if (statusNum >= 500) return "border-red-500 text-red-500";
		return "border-gray-400 text-gray-400";
	};

	const responseStatuses = operation.responses
		? Object.keys(operation.responses)
		: [];

	return (
		<Card className="border shadow-none rounded-lg bg-card/60">
			<Card.Header className="pt-5 px-5">
				<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide ">
					RESPONSE
				</h3>
			</Card.Header>
			<Card.Content className="pb-5 px-5">
				{/* Response Status Options */}
				{/* ?: What it's the purpose of these? */}
				{responseStatuses.length > 0 && (
					<div className="flex flex-wrap gap-2 mb-4">
						{responseStatuses.map((status) => (
							<Badge
								key={status}
								className={`${getStatusColor(status)} bg-transparent text-xs px-2 py-1`}
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
										className={`${getStatusColor(response.status.toString())} bg-transparent`}
									>
										{response.status}
									</Badge>
								</div>
								<div className="bg-card p-4 rounded-md text-sm font-mono overflow-x-auto text-foreground border max-h-64 overflow-y-auto">
									{highlightedData && (
										<Pre code={highlightedData} handlers={[lineNumbers]} />
									)}
								</div>
							</div>
						</Tabs.Content>
						<Tabs.Content value="headers" className="mt-4">
							<div className="bg-card p-4 rounded-md text-sm font-mono overflow-x-auto text-foreground border">
								{highlightedHeaders && (
									<Pre code={highlightedHeaders} handlers={[lineNumbers]} />
								)}
							</div>
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

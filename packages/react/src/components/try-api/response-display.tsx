import type {
	ApiResponse,
	EnhancedOperation,
	SchemaObject,
} from "@/core/types";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import { Badge, Card, Tabs } from "@rhinolabs/ui";
import { type AnnotationHandler, InnerLine, Pre } from "codehike/code";
import { Loader2, XCircle, XIcon } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

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
	isLoading: boolean;
	operation: EnhancedOperation;
	exampleRequestStatusCode?: string | null;
	getResponseExample: (statusCode: string) => SchemaObject | null;
	clearResponse: () => void;
}

function ResponseCardTitle({
	children,
	title,
}: { children: React.ReactNode; title: string }) {
	return (
		<div className="flex gap-3 items-center">
			{children}
			<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide ">
				{title}
			</h3>
		</div>
	);
}

export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({
	response,
	error,
	isLoading,
	exampleRequestStatusCode,
	getResponseExample,
	clearResponse,
}) => {
	const [exampleResponse, setExampleResponse] = useState<string | undefined>(
		undefined,
	);

	const highlightedData = useHighlightedCode(
		"json",
		response ? JSON.stringify(response.data, null, 2) : undefined,
	);
	const highlightedHeaders = useHighlightedCode(
		"json",
		response ? JSON.stringify(response.headers, null, 2) : undefined,
	);

	const highlightedExample = useHighlightedCode("json", exampleResponse);

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

	useEffect(() => {
		const highlightExampleResponse = () => {
			if (exampleRequestStatusCode) {
				const exampleResponseJSON = getResponseExample(
					exampleRequestStatusCode,
				);
				if (exampleResponseJSON) {
					return setExampleResponse(
						JSON.stringify(exampleResponseJSON, null, 2),
					);
				}
			}

			setExampleResponse(undefined);
		};

		highlightExampleResponse();
	}, [exampleRequestStatusCode, getResponseExample]);

	return (
		<Card className="border shadow-none rounded-lg bg-card/60">
			<Card.Header className="pt-5 px-5 flex-row justify-between items-center ">
				{response && (
					<ResponseCardTitle title="Response">
						<Badge
							className={`${getStatusColor(
								response.status.toString(),
							)} bg-transparent`}
						>
							{response.status}
						</Badge>
					</ResponseCardTitle>
				)}
				{exampleRequestStatusCode && (
					<ResponseCardTitle title="Example Response">
						<Badge
							className={`${getStatusColor(
								exampleRequestStatusCode,
							)} bg-transparent`}
						>
							{exampleRequestStatusCode}
						</Badge>
					</ResponseCardTitle>
				)}
				{(error || isLoading) && (
					<ResponseCardTitle title={isLoading ? "Loading..." : "Error"}>
						{isLoading && (
							<Loader2 className="h-4 w-4 animate-spin text-blue-500" />
						)}
						{error && <XCircle className="h-4 w-4 text-red-500" />}
					</ResponseCardTitle>
				)}
				<Badge
					onClick={clearResponse}
					variant="outline"
					className="cursor-pointer hover:bg-accent text-xs"
				>
					<XIcon />
					<span>Clear Response</span>
				</Badge>
			</Card.Header>
			<Card.Content className="pb-5 px-5">
				{error ? (
					<div className="text-center py-8 text-red-400">{error}</div>
				) : response || exampleResponse ? (
					<Tabs defaultValue="response" className="w-full">
						{response && (
							<Tabs.List className="grid w-full grid-cols-2 mb-1">
								<Tabs.Trigger value="response">Response</Tabs.Trigger>
								<Tabs.Trigger value="headers">Headers</Tabs.Trigger>
							</Tabs.List>
						)}
						<Tabs.Content value="response">
							<div className="bg-card p-4 rounded-md text-sm font-mono overflow-x-auto text-foreground border max-h-64 overflow-y-auto">
								{highlightedData && (
									<Pre code={highlightedData} handlers={[lineNumbers]} />
								)}
								{highlightedExample && (
									<Pre code={highlightedExample} handlers={[lineNumbers]} />
								)}
							</div>
						</Tabs.Content>
						<Tabs.Content value="headers">
							<div className="bg-card p-4 rounded-md text-sm font-mono overflow-x-auto text-foreground border">
								{highlightedHeaders && (
									<Pre code={highlightedHeaders} handlers={[lineNumbers]} />
								)}
							</div>
						</Tabs.Content>
					</Tabs>
				) : (
					<div className="text-center py-8 text-muted-foreground">
						<p>Response is empty or doesn't have an example</p>
					</div>
				)}
			</Card.Content>
		</Card>
	);
};

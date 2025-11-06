import type {
	OpenApiDocument,
	ResponseEntry,
	SchemaObject,
} from "@/types/api/openapi";
import { Button, Card, Collapsible } from "@rhinolabs/ui";
import { ChevronDown, ChevronRight } from "lucide-react";
import { memo } from "react";
import {
	MediaTypeContent,
	MediaTypeExamplesContent,
} from "./media-type-content";

interface ResponseCardProps {
	response: ResponseEntry;
	index: number;
	openIndex: number | null;
	handleToggle: (index: number) => void;
	doc: OpenApiDocument;
	success: boolean;
}

const renderMediaContent = (
	content: ResponseEntry["content"],
	doc: OpenApiDocument,
) => {
	if (!content || Object.keys(content).length === 0) {
		return (
			<div className="px-4 py-6">
				<p className="text-sm text-muted-foreground">No content available.</p>
			</div>
		);
	}

	// ?: content may have duplicate schemas

	return Object.entries(content).map(([mediaType, mediaObject]) =>
		mediaObject.examples ? (
			<MediaTypeExamplesContent
				key={`${mediaType}`}
				mediaType={mediaType}
				mediaObject={mediaObject as { examples: Record<string, SchemaObject> }}
				doc={doc}
			/>
		) : (
			<MediaTypeContent
				key={`${mediaType}`}
				mediaType={mediaType}
				mediaObject={mediaObject}
				doc={doc}
			/>
		),
	);
};

export const ResponseCard: React.FC<ResponseCardProps> = memo(
	({ response, index, openIndex, handleToggle, doc, success }) => {
		const cardClasses = success
			? "shadow-none rounded-lg mt-2"
			: "bg-primary-foreground border shadow-none rounded-lg mt-2";

		return (
			<Collapsible
				open={openIndex === index}
				onOpenChange={() => handleToggle(index)}
				className={index > 0 ? "border-t" : ""}
			>
				<div className="flex items-center justify-between space-x-4 px-4 py-3">
					<Collapsible.Trigger asChild>
						<div className="flex justify-between items-center w-full cursor-pointer">
							<div className="flex items-center">
								<span
									className={`rounded-full h-3 w-3 mr-2 border mt-0.5 ${
										success
											? "dark:border-green-500 dark:bg-transparent bg-green-600"
											: "dark:border-red-500 dark:bg-transparent bg-red-600"
									}`}
								/>
								<h4 className="text-xs font-medium">{response.status}</h4>
								<p className="text-xs text-muted-foreground ml-2">
									{response.description}
								</p>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="w-9 p-0"
								aria-label="Toggle response details"
							>
								{openIndex === index ? (
									<ChevronDown className="h-4 w-4 text-muted-foreground" />
								) : (
									<ChevronRight className="h-4 w-4 text-muted-foreground" />
								)}
								<span className="sr-only">Toggle</span>
							</Button>
						</div>
					</Collapsible.Trigger>
				</div>
				<Collapsible.Content>
					<div className="px-4 py-4 border-t rounded-b-lg overflow-hidden bg-background/50">
						<h4 className="text-sm font-medium text-muted-foreground">
							RESPONSE BODY
						</h4>
						<Card className={`${cardClasses} bg-card/60`}>
							<Card.Content className="p-0">
								{renderMediaContent(response.content, doc)}
							</Card.Content>
						</Card>
					</div>
				</Collapsible.Content>
			</Collapsible>
		);
	},
);

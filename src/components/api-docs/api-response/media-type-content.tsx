import type {
	MediaTypeObject,
	OpenApiDocument,
	SchemaObject,
} from "@/types/api/openapi";
import { resolveRef } from "@/utils/api/resolve-ref";
import { memo, useState } from "react";
import { Button, Card, Collapsible, Separator } from "@rhinolabs/ui";
import { MinusIcon, PlusIcon } from "lucide-react";
import { PropertiesList } from "./properties-list";

interface MediaTypeContentProps {
	mediaType: string;
	mediaObject: MediaTypeObject;
	doc: OpenApiDocument;
}

interface MediaTypeExamplesContentProps {
	mediaType: string;
	mediaObject: {
		examples?: Record<string, SchemaObject>;
	};
	doc: OpenApiDocument;
}

const resolveSchema = (
	mediaObject: MediaTypeObject,
	doc: OpenApiDocument,
): SchemaObject | undefined => {
	if (!mediaObject.schema) return undefined;

	if ("$ref" in mediaObject.schema) {
		const refSchema = resolveRef(mediaObject.schema.$ref, doc);

		if (!refSchema) {
			console.warn(`Unable to resolve reference: ${mediaObject.schema.$ref}`);
		}

		return refSchema;
	}

	return mediaObject.schema;
};

export const MediaTypeContent: React.FC<MediaTypeContentProps> = memo(
	({ mediaType, mediaObject, doc }) => {
		const resolvedSchema = resolveSchema(mediaObject, doc);

		if (!resolvedSchema) {
			return (
				<div className="mb-2">
					<p className="text-xs text-muted-foreground">No content available.</p>
				</div>
			);
		}

		if (resolvedSchema.properties) {
			return (
				<div key={`${mediaType}-${resolvedSchema.type}`}>
					<p className="text-sm font-medium text-muted-foreground px-6 py-4">
						{String(resolvedSchema.type ?? "Unknown type")}
					</p>
					<PropertiesList
						mediaType={mediaType}
						properties={resolvedSchema.properties}
						required={resolvedSchema.required}
					/>
				</div>
			);
		}

		return (
			<div key={`${mediaType}-no-properties`} className="mb-2">
				<p className="px-4 text-sm text-muted-foreground">
					No properties available for referenced schema.
				</p>
			</div>
		);
	},
);

export const MediaTypeExamplesContent: React.FC<MediaTypeExamplesContentProps> =
	memo(({ mediaType, mediaObject }) => {
		if (!mediaObject.examples) {
			return null;
		}
		const [openIndex, setOpenIndex] = useState<number | null>(null);
		const handleToggle = (index: number) => {
			setOpenIndex((prev) => (prev === index ? null : index));
		};

		return (
			<div key={`${mediaType}-examples`}>
				{Object.entries(mediaObject.examples).map(
					([exampleKey, exampleObj], index) => (
						<Collapsible
							key={`${mediaType}-collapsible-${exampleKey}`}
							open={openIndex === index}
							onOpenChange={() => handleToggle(index)}
							className={index > 0 ? "border-t" : ""}
						>
							<div className="flex items-center justify-between space-x-4 px-4 py-3">
								<Collapsible.Trigger asChild>
									<div className="flex justify-between items-center w-full cursor-pointer">
										<div>{exampleKey.toUpperCase()}</div>
										<Button
											variant="ghost"
											size="sm"
											className="w-9 p-0"
											aria-label="Toggle response details"
										>
											{openIndex === index ? (
												<MinusIcon className="h-4 w-4 text-muted-foreground" />
											) : (
												<PlusIcon className="h-4 w-4 text-muted-foreground" />
											)}
											<span className="sr-only">Toggle</span>
										</Button>
									</div>
								</Collapsible.Trigger>
							</div>
							<Collapsible.Content>
								<Separator />
								<Card className="m-4 shadow-none rounded-lg bg-primary-foreground">
									<p className="text-sm font-medium text-muted-foreground px-6 py-4">
										{String(exampleObj.type ?? "Unknown type")}
									</p>
									<div className="mb-2">
										<PropertiesList
											mediaType={mediaType}
											properties={exampleObj.properties ?? {}}
											required={exampleObj.required}
										/>
									</div>
								</Card>
							</Collapsible.Content>
						</Collapsible>
					),
				)}
			</div>
		);
	});

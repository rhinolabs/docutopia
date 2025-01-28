import { ParamField } from "@/components/ui/fields";
import type {
	MediaTypeObject,
	OpenApiDocument,
	SchemaObject,
} from "@/types/api/openapi";
import { mapSchemaToParamField } from "@/utils/map-schema-to-param-field";
import { resolveRef } from "@/utils/resolve-ref";
import { memo } from "react";

interface MediaTypeContentProps {
	mediaType: string;
	mediaObject: MediaTypeObject;
	doc: OpenApiDocument;
}

export const MediaTypeContent: React.FC<MediaTypeContentProps> = memo(
	({ mediaType, mediaObject, doc }) => {
		if (!mediaObject.schema) {
			return (
				<div className="mb-2">
					<p className="text-xs text-muted-foreground">No content available.</p>
				</div>
			);
		}

		let resolvedSchema: SchemaObject | undefined;

		if ("$ref" in mediaObject.schema) {
			const refSchema = resolveRef(mediaObject.schema.$ref, doc);
			if (refSchema) {
				resolvedSchema = refSchema;
			} else {
				console.warn(`Unable to resolve reference: ${mediaObject.schema.$ref}`);
				return (
					<div key={`${mediaType}-unresolved-ref`} className="mb-2">
						<p className="px-4 text-sm text-muted-foreground">
							Unable to resolve referenced schema.
						</p>
					</div>
				);
			}
		} else {
			resolvedSchema = mediaObject.schema;
		}

		if (resolvedSchema?.properties) {
			return (
				<div key={`${mediaType}-${resolvedSchema.type}`}>
					<p className="text-sm font-medium text-muted-foreground px-6 py-4">
						{String(resolvedSchema.type ?? "Unknown type")}
					</p>
					{Object.entries(resolvedSchema.properties).map(([key, value]) => (
						<div key={`${mediaType}-${key}`} className="mb-2">
							<hr />
							<ParamField
								field={mapSchemaToParamField(
									key,
									value as SchemaObject,
									resolvedSchema.required?.includes(key) ?? false,
								)}
								readOnly={true}
							/>
						</div>
					))}
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

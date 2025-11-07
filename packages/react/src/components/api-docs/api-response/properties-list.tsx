import { ParamField } from "@/components/ui/fields/param-field";
import type { SchemaOrRef } from "@/types/api/openapi";
import { mapSchemaToParamField } from "@/utils/fields/map-schema-to-param-field";
import { asSchemaObject } from "@/utils/type-guards";
import { Separator } from "@rhinolabs/ui";
import type React from "react";

interface PropertiesListProps {
	mediaType: string;
	properties: Record<string, SchemaOrRef>;
	required?: string[];
}

export const PropertiesList: React.FC<PropertiesListProps> = ({
	mediaType,
	properties,
	required = [],
}) => {
	return (
		<>
			{Object.entries(properties).map(([key, valueOrRef]) => {
				const value = asSchemaObject(valueOrRef);
				if (!value) return null;

				return (
					<div key={`${mediaType}-${key}`}>
						<Separator />
						<ParamField
							field={mapSchemaToParamField(key, value, required.includes(key))}
							readOnly={true}
						/>
					</div>
				);
			})}
		</>
	);
};

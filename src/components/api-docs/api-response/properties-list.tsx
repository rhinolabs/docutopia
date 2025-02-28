import type { SchemaObject } from "@/types/api/openapi";
import { Separator } from "@rhinolabs/ui";
import type React from "react";
import { ParamField } from "@/components/ui/fields/param-field";
import { mapSchemaToParamField } from "@/utils/fields/map-schema-to-param-field";

interface PropertiesListProps {
	mediaType: string;
	properties: Record<string, SchemaObject>;
	required?: string[];
}

export const PropertiesList: React.FC<PropertiesListProps> = ({
	mediaType,
	properties,
	required = [],
}) => {
	return (
		<>
			{Object.entries(properties).map(([key, value]) => (
				<div key={`${mediaType}-${key}`} className="mb-2">
					<Separator />
					<ParamField
						field={mapSchemaToParamField(key, value, required.includes(key))}
						readOnly={true}
					/>
				</div>
			))}
		</>
	);
};

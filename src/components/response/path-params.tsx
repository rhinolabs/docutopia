import type React from "react";
import { Card, CardContent, Input } from "@rhino-ui/ui";
import { ParamField } from "@/components/ui/param-field";
import type { PrimitiveField } from "@/types/requests";

interface PathParamsProps {
	pathParams: PrimitiveField[];
}

export const PathParams: React.FC<PathParamsProps> = ({ pathParams }) => {
	return (
		<>
			<div className="mt-5">
				<h3 className="text-sm font-semibold mb-4">PATH PARAMS</h3>
				<Card className="bg-primary-foreground border shadow-sm rounded-lg">
					<CardContent className="py-4">
						{pathParams.map((param) => (
							<ParamField key={param.name} field={param} />
						))}
					</CardContent>
				</Card>
			</div>
		</>
	);
};

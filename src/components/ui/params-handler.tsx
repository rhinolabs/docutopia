import { Card, CardContent, Separator } from "@rhino-ui/ui";
import { ParamField } from "@/components/ui/fields/param-field";
import type { ParameterObject } from "@/types/api/openapi";
import React from "react";

interface ParamsProps {
	params: ParameterObject[];
	title: string;
}

export const Params: React.FC<ParamsProps> = ({ params, title }) => {
	return (
		<div className="mt-5">
			<h3 className="text-sm font-semibold mb-4">{title}</h3>
			<Card className="bg-primary-foreground border shadow-xs rounded-lg">
				<CardContent className="p-0">
					{params.map((param, index) => (
						<React.Fragment key={param.name}>
							<ParamField field={param} />
							{index < params.length - 1 && <Separator />}
						</React.Fragment>
					))}
				</CardContent>
			</Card>
		</div>
	);
};

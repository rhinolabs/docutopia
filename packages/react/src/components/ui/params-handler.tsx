import { ParamField } from "@/components/ui/fields/param-field";
import type { ParameterObject } from "@/types/api/openapi";
import { Card, Separator } from "@rhinolabs/ui";
import React from "react";

interface ParamsProps {
	params: ParameterObject[];
	title: string;
}

export const Params: React.FC<ParamsProps> = ({ params, title }) => {
	return (
		<div className="mt-5">
			<h3 className="text-sm font-semibold mb-4">{title}</h3>
			<Card className="bg-card border shadow-xs rounded-lg">
				<Card.Content className="p-0">
					{params.map((param, index) => (
						<React.Fragment key={param.name}>
							<ParamField field={param} bodyPath={[]} />
							{index < params.length - 1 && <Separator />}
						</React.Fragment>
					))}
				</Card.Content>
			</Card>
		</div>
	);
};

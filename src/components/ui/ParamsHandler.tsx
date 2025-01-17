import { Card, CardContent } from "@rhino-ui/ui";
import { ParamField } from "@/components/ui/fields/ParamField";
import type { PrimitiveField } from "@/types/components/FieldTypes";

interface ParamsProps {
	params: PrimitiveField[];
	title: string;
}

export const Params: React.FC<ParamsProps> = ({ params, title }) => {
	return (
		<div className="mt-5">
			<h3 className="text-sm font-semibold mb-4">{title}</h3>
			<Card className="bg-primary-foreground border shadow-sm rounded-lg">
				<CardContent className="p-0">
					{params.map((param, index) => (
						<>
							<ParamField key={param.name} field={param} />
							{index < params.length - 1 && <hr />}
						</>
					))}
					<hr />
				</CardContent>
			</Card>
		</div>
	);
};

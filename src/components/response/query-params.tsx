import { Card, CardContent, Input } from "@rhino-ui/ui";
import { DynamicFields } from "../ui/dynamic-fields";

export const QueryParams = () => {
	return (
		<div className="mt-5">
			<h3 className="text-sm font-semibold mb-4">QUERY PARAMS</h3>
			<Card className="bg-primary-foreground border shadow-sm rounded-lg">
				<CardContent className="py-2 px-0">
					<div className="px-6 py-4 grid grid-cols-4 gap-4">
						<div className="col-span-3">
							<div className="text-sm mb-2">
								<span className="font-semibold mr-1">pageNum</span>
								<span className="text-muted-foreground mr-1">integer</span>
								<span className="text-muted-foreground mr-1">≥ 1</span>
								<span className="text-muted-foreground mr-1">
									Defaults to 1
								</span>
							</div>
							<p className="text-sm font-medium">The page number.</p>
						</div>
						<div className="col-span-1">
							<Input
								id="pathParamId"
								className="border bg-white"
								type="number"
								placeholder="1"
							></Input>
						</div>
					</div>
					<hr />
					<div className="px-6 py-4 grid grid-cols-4 gap-4">
						<div className="col-span-3">
							<div className="text-sm mb-2">
								<span className="font-semibold mr-1">pageSize</span>
								<span className="text-muted-foreground mr-1">integer</span>
								<span className="text-muted-foreground mr-1">5 to 200</span>
								<span className="text-muted-foreground mr-1">
									Defaults to 50
								</span>
							</div>
							<p className="text-sm font-medium">The page size.</p>
						</div>
						<div className="col-span-1">
							<Input
								id="pathParamId"
								className="border bg-white"
								type="number"
								placeholder="50"
							></Input>
						</div>
					</div>
					<hr />
					<div className="px-6 py-4">
						<div className="mb-2">
							<div className="text-sm mb-2">
								<span className="font-semibold mr-1">entityIds</span>
								<span className="text-muted-foreground mr-1">
									array of strings
								</span>
							</div>
							<p className="text-sm font-medium">The entity Ids.</p>
						</div>
						<DynamicFields />
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

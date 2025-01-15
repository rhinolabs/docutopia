import {
	Button,
	Card,
	CardHeader,
	CardContent,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Input,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@rhino-ui/ui";
import { Plus } from "lucide-react";
import { useState } from "react";

export const BodyParams = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<div className="mt-5">
				<h3 className="text-sm font-semibold mb-4">BODY PARAMS</h3>
				<Card className="bg-primary-foreground border shadow-sm rounded-lg">
					<CardHeader className="pb-0">
						<div>
							<span className="mr-1">entity</span>
							<span className="mr-1 text-muted-foreground">object</span>
							<span className="mr-1 text-red-600">required</span>
						</div>
					</CardHeader>
					<CardContent className="py-4">
						<Collapsible
							open={isOpen}
							onOpenChange={setIsOpen}
							className="border rounded-lg bg-white"
						>
							<div className="flex items-center justify-between space-x-4 px-4 py-2">
								<CollapsibleTrigger asChild>
									<div className="flex justify-between items-center w-full cursor-pointer">
										<h4 className="text-sm font-semibold">ENTITY OBJECT</h4>
										<Button variant="ghost" size="sm" className="w-9 p-0">
											<Plus className="h-4 w-4 text-muted-foreground" />
											<span className="sr-only">Toggle</span>
										</Button>
									</div>
								</CollapsibleTrigger>
							</div>
							<CollapsibleContent>
								<div className="px-4 py-4 text-sm border-t grid grid-cols-4 gap-4">
									<div className="col-span-3">
										<div>
											<span className="mr-1">type</span>
											<span className="mr-1 text-muted-foreground">string</span>
											<span className="mr-1 text-red-600">required</span>
										</div>
										<p className="text-sm">The entity type.</p>
									</div>
									<div className="col-span-1">
										<Select>
											<SelectTrigger>
												<SelectValue placeholder="Select" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectItem value="organization">
														Organization
													</SelectItem>
													<SelectItem value="linkCode">LinkCode</SelectItem>
													<SelectItem value="project">Project</SelectItem>
													<SelectItem value="team">Team</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="px-4 py-4 text-sm border-t grid grid-cols-4 gap-4">
									<div className="col-span-3">
										<div>
											<span className="mr-1">id</span>
											<span className="mr-1 text-muted-foreground">string</span>
											<span className="mr-1 text-red-600">required</span>
										</div>
										<p className="text-sm">The entity id.</p>
									</div>
									<div className="col-span-1">
										<Input
											id="pathParamId"
											className="border bg-white"
											type="text"
											placeholder="organizationId"
										></Input>
									</div>
								</div>
							</CollapsibleContent>
						</Collapsible>
					</CardContent>
				</Card>
			</div>
		</>
	);
};

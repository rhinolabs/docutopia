import { Card } from "@rhinolabs/ui";
import type React from "react";
import { useState } from "react";

import type { OpenApiDocument, ResponseEntry } from "@/types/api/openapi";

import { ResponseCard } from "./response-card";

interface ResponseTypesProps {
	responses: ResponseEntry[];
	doc: OpenApiDocument;
}

export const ResponseTypes: React.FC<ResponseTypesProps> = ({
	responses,
	doc,
}) => {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const handleToggle = (index: number) => {
		setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
	};

	const isSuccess = (status: string) => status.startsWith("2");

	return (
		<div className="mt-5">
			<h3 className="text-sm font-semibold mb-4">RESPONSE</h3>
			<Card className="bg-card/60 border shadow-xs rounded-lg">
				<Card.Content className="p-0">
					{responses.map((response, index) => {
						const success = isSuccess(response.status);

						return (
							<ResponseCard
								key={`${response.status}-card`}
								response={response}
								index={index}
								openIndex={openIndex}
								handleToggle={handleToggle}
								doc={doc}
								success={success}
							/>
						);
					})}
				</Card.Content>
			</Card>
		</div>
	);
};

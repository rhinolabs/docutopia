import { CopyButton } from "@/components/common/copy-button";
import { Card } from "@rhinolabs/ui";
import type React from "react";

interface CurlDisplayProps {
	curlCommand: string;
}

export const CurlDisplay: React.FC<CurlDisplayProps> = ({ curlCommand }) => {
	return (
		<Card className="border shadow-none rounded-lg bg-card">
			<Card.Header>
				<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
					CURL REQUEST
				</h3>
			</Card.Header>
			<Card.Content>
				<div className="relative">
					<pre className="bg-input p-4 rounded-md text-sm font-mono overflow-x-auto text-foreground border max-h-40">
						<code>{curlCommand}</code>
					</pre>
					<CopyButton
						text={curlCommand}
						className="absolute top-2 right-2 hover:bg-accent"
					/>
				</div>
			</Card.Content>
		</Card>
	);
};

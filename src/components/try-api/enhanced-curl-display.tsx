import type React from "react";
import { Card, Button } from "@rhinolabs/ui";
import { Copy, Terminal } from "lucide-react";
import { useCopyToClipboard } from "@/hooks";

interface EnhancedCurlDisplayProps {
	curlCommand: string;
	title?: string;
	className?: string;
}

export const EnhancedCurlDisplay: React.FC<EnhancedCurlDisplayProps> = ({
	curlCommand,
	title = "cURL Request",
	className = "",
}) => {
	const { copy, isCopied } = useCopyToClipboard();

	const handleCopy = () => {
		copy(curlCommand);
	};

	return (
		<Card className={`border ${className}`}>
			<Card.Header className="pb-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Terminal className="h-4 w-4 text-muted-foreground" />
						<h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
							{title}
						</h3>
					</div>
					<Button
						variant="ghost"
						size="sm"
						onClick={handleCopy}
						className="text-muted-foreground hover:text-foreground"
					>
						<Copy className="h-4 w-4" />
						{isCopied ? "Copied!" : "Copy"}
					</Button>
				</div>
			</Card.Header>

			<Card.Content>
				<pre className="text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap break-all bg-muted/50 p-3 rounded-md border">
					<code className="text-foreground">{curlCommand}</code>
				</pre>
			</Card.Content>
		</Card>
	);
};

import { useCopyToClipboard } from "@/hooks";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import { Button, Card } from "@rhinolabs/ui";
import { Pre } from "codehike/code";
import { Copy, Terminal } from "lucide-react";
import type React from "react";

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
	const highlightedCurlCommand = useHighlightedCode("bash", curlCommand);
	const handleCopy = () => {
		copy(curlCommand);
	};

	return (
		<Card className={`border bg-card/70 ${className}`}>
			<Card.Header className="pb-3 pt-4 px-5">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Terminal className="h-4 w-4 text-muted-foreground" />
						<h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
							{title}
						</h3>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={handleCopy}
						className="text-muted-foreground bg-inherit font-normal hover:text-foreground"
					>
						<Copy className="h-4 w-4" />
						<span className="leading-none">
							{isCopied ? "Copied!" : "Copy"}
						</span>
					</Button>
				</div>
			</Card.Header>

			<Card.Content className="pb-5 px-5">
				<div className="text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap break-all bg-card p-3 rounded-md border">
					{highlightedCurlCommand && <Pre code={highlightedCurlCommand} />}
				</div>
			</Card.Content>
		</Card>
	);
};

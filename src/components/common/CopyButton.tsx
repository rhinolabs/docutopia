import type React from "react";
import { Button } from "@rhinolabs/ui";
import { Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface CopyButtonProps {
	text: string;
	size?: "sm" | "lg";
	variant?: "default" | "outline" | "ghost";
	className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
	text,
	size = "sm",
	variant = "ghost",
	className = "",
}) => {
	const { copy, isCopied } = useCopyToClipboard();

	return (
		<Button
			variant={variant}
			size={size}
			onClick={() => copy(text)}
			className={`${className} ${isCopied ? "text-green-500" : ""}`}
		>
			{isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
		</Button>
	);
};

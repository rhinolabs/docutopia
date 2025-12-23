import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);

	return (
		<button
			type="button"
			onClick={() => {
				navigator.clipboard.writeText(text);
				setCopied(true);
				setTimeout(() => setCopied(false), 1200);
			}}
			className="
        absolute top-3 right-3 z-10
        rounded-md p-2
        text-zinc-400 hover:text-white
        hover:bg-zinc-800
        transition
      "
		>
			{copied ? <Check size={16} /> : <Copy size={16} />}
		</button>
	);
}

import { Copy, Check } from "lucide-react";
import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    return (
        <button
            type="button"
            className="absolute top-4 right-4 z-10 hover:bg-[#23242A] p-2 rounded-lg text-[#A5A7AC] hover:text-white transition-colors focus:outline-none active:scale-95"
            onClick={() => {
                navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
            }}
            style={{
                boxShadow: "0 2px 16px 0 #00000010, 0 1.5px 5px 0 #00000030",
            }}
        >
            {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
    );
}



import { Copy,Check, Import } from "lucide-react";
import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

    return (
    <button
        type="button"
        className="absolute top-3 right-3 z-10 hover:bg-[#2B395B] p-2 rounded-full text-gray-400 hover:text-white shadow transition"
        aria-label="Copy to clipboard"
        onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
        }}
        style={{
        boxShadow: "0 2px 16px 0 #00000010, 0 1.5px 5px 0 #00000030",
        }}
    >
        {copied ? <Check size={18} /> : <Copy size={18} />}
    </button>
    );
}



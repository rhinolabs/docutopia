import { Pre, highlight } from "codehike/code";
import type { HighlightedCode } from "codehike/code";
import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react"

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      className="text-white absolute right-2"
      aria-label="Copy to clipboard"
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
      }}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  )
}
interface CodeBlockProps {
  code: string;
  className?: string;
}

export const CodeLine = ({ code, className }: CodeBlockProps) => {
  const [highlighted, setHighlighted] = useState<HighlightedCode | null>(null);

  useEffect(() => {
    highlight({ lang: "bash", value: code, meta: "" }, "github-dark").then(setHighlighted);
  }, [code]);

  return ( 
    <div className={`relative ${className}`}>
      <CopyButton text={code} />
      {highlighted && <Pre code={highlighted} handlers={[]}/>}
    </div>
   );
}
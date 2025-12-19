import { Pre, highlight } from "codehike/code";
import type { HighlightedCode } from "codehike/code";
import { useEffect, useState } from "react";
import { CopyButton } from "./copy-button.tsx";

interface CodeLineProps {
	code: string;
	className?: string;
	lang?: string;
}

export const CodeLine = ({ code, className = "", lang = "bash" }: CodeLineProps) => {
	const [highlighted, setHighlighted] = useState<HighlightedCode | null>(null);

	useEffect(() => {
		highlight({ lang, value: code, meta: "" }, "github-dark").then(
			setHighlighted,
		);
	}, [code, lang]);

	return (
    <div className={`relative rounded-xl px-5 py-4 overflow-x-auto font-mono text-base ${className}`}>
      {highlighted && (
        <>
          <CopyButton text={highlighted.code} />
          <Pre
            code={highlighted}
            handlers={[]}
            className="!bg-transparent !shadow-none !border-none !m-0 !p-0 text-base"
          />
        </>
      )}
    </div>
  );
}
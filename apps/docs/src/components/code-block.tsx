// components/code-block.tsx
import { Pre, highlight } from "codehike/code";
import { useEffect, useState } from "react";
import { CopyButton } from "./copy-button";
import { lineNumbers } from "./handlers/line-numbers";

export function CodeBlock({ code, className = "", lang = "js" }) {
  const [highlighted, setHighlighted] = useState<any>(null);

  useEffect(() => {
    highlight({ lang, value: code, meta: "" }, "dark-plus").then(setHighlighted);
  }, [code, lang]);

  return (
    <div 
		className={`relative rounded-xl px-0 py-0 overflow-x-auto font-mono text-base ${className}`}>     
	 {highlighted && (
        <>
          <CopyButton text={highlighted.code} />
          <Pre
            code={highlighted}
            handlers={[lineNumbers]}
            className="!bg-transparent !border-none !shadow-none !m-0 !py-4 !pl-5 !pr-12 font-mono text-base"
          />
        </>
      )}
    </div>
  );
}
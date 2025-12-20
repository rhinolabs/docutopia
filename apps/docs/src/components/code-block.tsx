import { Pre, highlight } from "codehike/code";
import { useEffect, useState } from "react";
import { CopyButton } from "./copy-button";
import { lineNumbers } from "./handlers/line-numbers";

export function CodeBlock({ code, className = "", lang = "js", showCopy = true }) {
  const [highlighted, setHighlighted] = useState<any>(null);

  useEffect(() => {
    highlight({ lang, value: code, meta: "" }, "dark-plus").then(setHighlighted);
  }, [code, lang]);

  return (
    <div className="relative rounded-xl font-mono text-base bg-black">
      {highlighted && showCopy && <CopyButton text={highlighted.code} />}
      <div className="overflow-x-auto pr-12 pl-4 py-4">
        {highlighted && (
          <Pre
            code={highlighted}
            handlers={[lineNumbers]}
            className="!bg-transparent !border-none !shadow-none !m-0 !p-0 text-base"
          />
        )}
      </div>
    </div>
  );
}
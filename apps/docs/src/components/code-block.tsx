import { Pre, highlight } from "codehike/code";
import { useEffect, useState } from "react";
import { CopyButton } from "./copy-button";
import { lineNumbers } from "./handlers/line-numbers";

interface Props {
  code: string;
  lang?: string;
  showCopy?: boolean;
}

export function CodeBlock({
  code,
  lang = "js",
  showCopy = true,
}: Props) {
  const [highlighted, setHighlighted] = useState<any>(null);

  useEffect(() => {
    highlight({ lang, value: code, meta: "" }, "dark-plus").then(setHighlighted);
  }, [code, lang]);

  if (!highlighted) return null;

  return (
    <div className="relative rounded-xl bg-black">
      {showCopy && <CopyButton text={highlighted.code} />}
      <div className="overflow-x-auto px-4 py-4 pr-12">
        <Pre
          code={highlighted}
          handlers={[lineNumbers]}
          className="!bg-transparent !p-0 !m-0"
        />
      </div>
    </div>
  );
}

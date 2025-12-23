import { Pre, highlight } from "codehike/code";
import { useEffect, useState } from "react";
import { CopyButton } from "./copy-button";

interface Props {
  code: string;
  lang?: string;
  showCopy?: boolean;
}

export function CodeLine({
  code,
  lang = "bash",
  showCopy = true,
}: Props) {
  const [highlighted, setHighlighted] = useState<any>(null);

  useEffect(() => {
    highlight({ lang, value: code, meta: "" }, "dark-plus").then(setHighlighted);
  }, [code, lang]);

  if (!highlighted) return null;

  return (
    <div className="relative rounded-xl bg-black px-4 py-4 pr-12">
      {showCopy && <CopyButton text={highlighted.code} />}
      <Pre
        code={highlighted}
        className="!bg-transparent !p-0 !m-0"
      />
    </div>
  );
}

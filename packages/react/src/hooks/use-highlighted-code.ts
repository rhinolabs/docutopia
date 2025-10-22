import { highlight, HighlightedCode as HighlightedCodeType } from "codehike/code";
import { useEffect, useState } from "react";

export const useHighlightedCode = (lang: string, code?: string) => {
  const [highlightedCode, setHighlightedCode] = useState<HighlightedCodeType>();
  async function generateHighlightedCode(value: string) {
    const highlightedCode = await highlight({value, lang, meta: ""}, "github-dark");
    setHighlightedCode(highlightedCode);
  }

    useEffect(() => {
      if (code) {
        generateHighlightedCode(
          code
        );
      }
    }, [code])

  return highlightedCode;
}
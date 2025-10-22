import {
	type HighlightedCode as HighlightedCodeType,
	highlight,
} from "codehike/code";
import { useEffect, useState } from "react";

export const useHighlightedCode = (lang: string, code?: string) => {
	const [highlightedCode, setHighlightedCode] = useState<HighlightedCodeType>();

	useEffect(() => {
		async function generateHighlightedCode(value: string) {
			const highlightedCode = await highlight(
				{ value, lang, meta: "" },
				"github-dark",
			);
			setHighlightedCode(highlightedCode);
		}

		if (code) {
			generateHighlightedCode(code);
		}
	}, [code, lang]);

	return highlightedCode;
};

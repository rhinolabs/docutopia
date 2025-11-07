import {
	type HighlightedCode as HighlightedCodeType,
	highlight,
} from "codehike/code";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const useHighlightedCode = (lang: string, code?: string) => {
	const [highlightedCode, setHighlightedCode] = useState<HighlightedCodeType>();
	const { resolvedTheme } = useTheme();

	useEffect(() => {
		async function generateHighlightedCode(value: string) {
			const highlightedCode = await highlight(
				{ value, lang, meta: "" },
				resolvedTheme === "dark" ? "github-dark" : "github-light",
			);
			setHighlightedCode(highlightedCode);
			console.log("Highlighted code generated with theme:", resolvedTheme);
		}

		if (code) {
			generateHighlightedCode(code);
		}
	}, [code, lang, resolvedTheme]);

	return highlightedCode;
};

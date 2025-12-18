import { Pre, highlight } from "codehike/code";
import type { HighlightedCode } from "codehike/code";
import { useEffect, useState } from "react";
import { lineNumbers } from "./handlers/line-numbers";

interface CodeBlockProps {
	code: string;
	className?: string;
}

export const CodeBlock = ({ code, className }: CodeBlockProps) => {
	const [highlighted, setHighlighted] = useState<HighlightedCode | null>(null);

	useEffect(() => {
		highlight({ lang: "ts", value: code, meta: "" }, "github-dark").then(
			setHighlighted,
		);
	}, [code]);

	return (
		<div className={`${className}`}>
			{highlighted && <Pre code={highlighted} handlers={[lineNumbers]} />}
		</div>
	);
};

import { InnerLine } from "codehike/code";
import type { AnnotationHandler } from "codehike/code";

export const lineNumbers: AnnotationHandler = {
	name: "line-numbers",
	Line: (props) => {
		const width = props.totalLines.toString().length + 1;
		return (
			<div className="flex">
				<span
				className="text-right select-none mr-4"
				style={{
					minWidth: `${width}ch`,
					color: "#ffffffff",
					fontSize: "0.97em",
					opacity: 0.7,
					fontFamily: "Fira Mono, monospace"
				}}
			>
					{props.lineNumber}
				</span>
				<InnerLine merge={props} className="flex-1" />
			</div>
		);
	},
};

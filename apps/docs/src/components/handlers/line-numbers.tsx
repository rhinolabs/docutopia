import { InnerLine } from "codehike/code";
import type { AnnotationHandler } from "codehike/code";

export const lineNumbers: AnnotationHandler = {
	name: "line-numbers",
	Line(props) {
		const width = props.totalLines.toString().length + 1;

		return (
			<div className="flex">
				<span
					className="select-none mr-4 text-zinc-500 text-sm"
					style={{ minWidth: `${width}ch` }}
				>
					{props.lineNumber}
				</span>
				<InnerLine merge={props} className="flex-1" />
			</div>
		);
	},
};

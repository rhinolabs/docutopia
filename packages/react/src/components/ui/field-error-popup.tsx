import type { Rule } from "@/utils/fields/field-to-schema";
import { CheckIcon, XIcon } from "lucide-react";
import type { $ZodIssue } from "zod/v4/core";

interface FieldErrorPopUpProps {
	rules: Rule[];
	error: $ZodIssue[];
}

export const FieldErrorPopUp = ({ rules, error }: FieldErrorPopUpProps) => {
	return (
		<div className="top-[calc(100%+0.5rem)] absolute bg-input rounded-sm border border-zinc-500 z-10 hidden peer-focus:block min-w-full shadow-2xl">
			{rules.map((rule) => {
				const issue = error.find((e) => e.message === rule.longMessage);

				return (
					<div
						key={rule.shortMessage}
						className={`flex items-center gap-2 px-2 py-2 hover:bg-white/10 ${issue && "bg-red-700/10 hover:bg-red-400/20!"}`}
						title={rule.longMessage}
					>
						{issue ? (
							<XIcon className="size-4 text-red-500" />
						) : (
							<CheckIcon className="size-4 text-emerald-500" />
						)}
						<span className="text-sm text-pretty flex-1">
							{rule.shortMessage}
						</span>
					</div>
				);
			})}
		</div>
	);
};

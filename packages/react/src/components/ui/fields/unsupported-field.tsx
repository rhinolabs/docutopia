import type React from "react";

interface UnsupportedFieldProps {
	type: string;
}

const UnsupportedField: React.FC<UnsupportedFieldProps> = ({ type }) => (
	<div className="text-red-500">
		Unsupported field type: {type}. Please contact support.
	</div>
);

export default UnsupportedField;

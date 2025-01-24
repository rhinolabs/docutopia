export const DefaultErrorSchema = {
	type: "object",
	required: true,
	properties: {
		message: { type: "string", required: true },
		requestId: { type: "string", required: true },
		errorCode: { type: "string", required: true },
		errors: {
			type: "array",
			required: false,
			items: { type: "string" },
		},
	},
};

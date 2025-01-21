export type ApiResponse = {
	status: number;
	success: boolean;
	name?: string;
	type?: string;
	message?: string;
	schema?: {
		[key: string]: {
			type: string;
			required: boolean;
			items?: {
				type: string;
			};
		};
	};
};

export type ResponseTypesProps = {
	responses: ApiResponse[];
};

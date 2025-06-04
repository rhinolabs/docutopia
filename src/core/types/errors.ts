// Error types
export class AppError extends Error {
	constructor(
		message: string,
		public code: string,
		public statusCode?: number,
	) {
		super(message);
		this.name = "AppError";
	}
}

export class OpenApiError extends AppError {
	constructor(message: string, statusCode?: number) {
		super(message, "OPENAPI_ERROR", statusCode);
		this.name = "OpenApiError";
	}
}

export class RequestError extends AppError {
	constructor(message: string, statusCode?: number) {
		super(message, "REQUEST_ERROR", statusCode);
		this.name = "RequestError";
	}
}

export const errorHandler = {
	handle: (error: unknown) => {
		if (error instanceof AppError) {
			return {
				message: error.message,
				code: error.code,
				statusCode: error.statusCode,
			};
		}

		return {
			message: "An unexpected error occurred",
			code: "UNKNOWN_ERROR",
			statusCode: 500,
		};
	},
};

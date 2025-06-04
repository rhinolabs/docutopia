import type { RequestConfig, ApiResponse } from "@/core/types";
import { RequestError } from "@/core/types/errors";
import { APP_CONFIG } from "@/core/config/constants";

export class ApiClient {
	constructor(
		private baseURL = "",
		private timeout = APP_CONFIG.REQUEST_TIMEOUT,
	) {}

	async request<T = unknown>(config: RequestConfig): Promise<ApiResponse<T>> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeout);

		try {
			// Build URL with query parameters
			let url = `${this.baseURL}${config.path}`;
			if (config.query && Object.keys(config.query).length > 0) {
				const queryParams = new URLSearchParams();
				for (const [key, value] of Object.entries(config.query)) {
					if (value !== undefined && value !== null && value !== "") {
						queryParams.append(key, String(value));
					}
				}
				if (queryParams.toString()) {
					url += `?${queryParams.toString()}`;
				}
			}

			const response = await fetch(url, {
				method: config.method,
				headers: { "Content-Type": "application/json", ...config.headers },
				body: config.body ? JSON.stringify(config.body) : undefined,
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			let data: T;
			try {
				data = await response.json();
			} catch {
				data = (await response.text()) as unknown as T;
			}

			if (!response.ok) {
				throw new RequestError(
					`Request failed: ${response.statusText}`,
					response.status,
				);
			}

			const responseHeaders: Record<string, string> = {};
			response.headers.forEach((value, key) => {
				responseHeaders[key] = value;
			});

			return {
				status: response.status,
				headers: responseHeaders,
				data,
			};
		} catch (error) {
			clearTimeout(timeoutId);
			if (error instanceof RequestError) throw error;
			throw new RequestError(
				`Request failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	async get<T>(path: string, headers?: Record<string, string>) {
		return this.request<T>({ method: "GET", path, headers });
	}

	async post<T>(
		path: string,
		body?: unknown,
		headers?: Record<string, string>,
	) {
		return this.request<T>({ method: "POST", path, body, headers });
	}

	async put<T>(path: string, body?: unknown, headers?: Record<string, string>) {
		return this.request<T>({ method: "PUT", path, body, headers });
	}

	async delete<T>(path: string, headers?: Record<string, string>) {
		return this.request<T>({ method: "DELETE", path, headers });
	}
}

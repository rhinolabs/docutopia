export type RequestType =
	| "GET"
	| "POST"
	| "PUT"
	| "DELETE"
	| "PATCH"
	| "HEAD"
	| "OPTIONS"
	| "CONNECT"
	| "TRACE";

export interface RequestItem {
	title: string;
	url: string;
	requestType: RequestType;
}

export interface Request {
	title: string;
	url: string;
	isActive?: boolean;
	items?: RequestItem[];
}

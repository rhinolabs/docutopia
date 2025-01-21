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
	name: string;
	url: string;
	requestType: RequestType;
}

export interface Request {
	name: string;
	url: string;
	isActive?: boolean;
	items?: RequestItem[];
}

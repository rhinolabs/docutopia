import type { RequestType } from "@/types/api/requests";

const requestTypeClasses: Record<RequestType, string> = Object.freeze({
	GET: "bg-get",
	POST: "bg-post",
	PUT: "bg-put",
	DELETE: "bg-delete",
	PATCH: "bg-patch",
	HEAD: "bg-head",
	OPTIONS: "bg-options",
	CONNECT: "bg-connect",
	TRACE: "bg-trace",
});

export const getRequestTypeClass = (requestType: RequestType): string => {
	return requestTypeClasses[requestType] || "bg-gray-300";
};

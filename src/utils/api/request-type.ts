const requestTypeClasses: Record<string, string> = Object.freeze({
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

export const getRequestTypeClass = (requestType: string): string => {
	return requestTypeClasses[requestType.toUpperCase()] || "bg-gray-300";
};
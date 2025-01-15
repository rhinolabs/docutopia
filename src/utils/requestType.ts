import type { RequestType } from "@/types/requests";

export const getRequestTypeClass = (requestType: RequestType) => {
	const classes: Record<RequestType, string> = {
		GET: "bg-get",
		POST: "bg-post",
		PUT: "bg-put",
		DELETE: "bg-delete",
		PATCH: "bg-patch",
		HEAD: "bg-head",
		OPTIONS: "bg-options",
		CONNECT: "bg-connect",
		TRACE: "bg-trace",
	};
	return classes[requestType] || "bg-gray-300";
};

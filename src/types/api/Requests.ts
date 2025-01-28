export const REQUEST_TYPES = [
	"GET",
	"POST",
	"PUT",
	"DELETE",
	"PATCH",
	"HEAD",
	"OPTIONS",
	"CONNECT",
	"TRACE",
];

export type RequestType = (typeof REQUEST_TYPES)[number];

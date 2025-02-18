export const REQUEST_TYPES = [
	"get",
	"post",
	"put",
	"delete",
	"patch",
	"head",
	"options",
	"connect",
	"trace",
];

export type RequestType = (typeof REQUEST_TYPES)[number];

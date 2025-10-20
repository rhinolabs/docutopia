export function slugifyOperation(input: string) {
	return input
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-+/, "")
		.replace(/-+$/, "");
}

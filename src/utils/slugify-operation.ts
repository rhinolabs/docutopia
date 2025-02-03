export function slugifyOperation(input: string) {
	return input
		.toLocaleLowerCase()
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-+/, "")
		.replace(/-+$/, "");
}

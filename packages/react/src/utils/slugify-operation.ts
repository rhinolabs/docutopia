import slugify from "@sindresorhus/slugify";

export function slugifyOperation(input: string) {
	return slugify(input, {
		decamelize: true, // Converts camelCase to kebab-case
		lowercase: true,
		separator: "-",
	});
}

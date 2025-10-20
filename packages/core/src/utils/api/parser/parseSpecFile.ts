import yaml from "js-yaml";

/**
 * Tries to parse a file content string as JSON first.
 * If it fails, it falls back to YAML parsing.
 *
 * @param content - The raw file content as a string.
 * @returns The parsed object (JSON or YAML).
 * @throws Error if neither JSON nor YAML parsing succeeds.
 */
export function parseSpecFile(content: string): unknown {
	try {
		return JSON.parse(content);
	} catch (jsonError) {
		try {
			return yaml.load(content);
		} catch (yamlError) {
			throw new Error("The file is not a valid JSON or YAML document.");
		}
	}
}

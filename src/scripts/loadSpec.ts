import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseSpecFile } from "@/utils/api/parser/parseSpecFile";
import { parser } from "@/utils/api/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadSpec() {
	try {
		const specPath = path.resolve(__dirname, "../mocks/openapi.json");
		const fileContent = await fs.readFile(specPath, "utf8");

		const parsedContent = parseSpecFile(fileContent);

		const openApiDoc = await parser.parse(parsedContent);
		console.log("Parsed OpenAPI Document:", openApiDoc);
	} catch (error) {
		console.error("Error loading the OpenAPI specification:", error);
	}
}

loadSpec();

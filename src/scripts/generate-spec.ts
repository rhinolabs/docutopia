#!/usr/bin/env node

import { transformOpenApiToSidebar } from "@/utils/api/openapi-adapter";
import { parser } from "@/utils/api/parser";
import { parseSpecFile } from "@/utils/api/parser/parseSpecFile";
import { Command } from "commander";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const program = new Command();
program
	.description("Generate parsed OpenAPI spec with sidebar")
	.requiredOption("-s, --spec <path>", "Path to OpenAPI spec (YAML or JSON)")
	.option("-o, --output <folder>", "Output folder", "public/specs")
	.option("-f, --file <filename>", "Output filename", "openapi.json");

program.parse();
const { spec, output, file } = program.opts();

(async () => {
	try {
		const specPath = path.resolve(process.cwd(), spec);
		console.log(`Reading spec from: ${specPath}`);
		const content = await readFile(specPath, "utf8");

		const parsed = parseSpecFile(content);
		const openApiDoc = await parser.parse(parsed);
		console.log("Parsed OpenAPI Document");
		const sidebar = await transformOpenApiToSidebar(openApiDoc);
		console.log("Generated Sidebar Data");

		const enhanced = { ...openApiDoc, sidebar };
		const outputFolder = path.resolve(process.cwd(), output);
		await mkdir(outputFolder, { recursive: true });
		const outputPath = path.join(outputFolder, file);
		await writeFile(outputPath, JSON.stringify(enhanced, null, 2), "utf8");
		console.log(`Written enhanced spec to: ${outputPath}`);
	} catch (err) {
		console.error("Error generating spec:", err);
		process.exit(1);
	}
})();

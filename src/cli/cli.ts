#!/usr/bin/env node

import { Command } from "commander";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseSpecFile } from "@/utils/api/parser/parseSpecFile";
import { parser } from "@/utils/api/parser";
import { transformOpenApiToSidebar } from "@/utils/api/openapi-adapter";
import type { MakeDirectoryOptions, ObjectEncodingOptions } from "node:fs";

const program = new Command();

program
	.name("docutopia")
	.description(
		"CLI to generate API documentation from an OpenAPI spec (YAML or JSON)",
	)
	.version("1.0.0");

program
	.command("generate")
	.description("Generate parsed OpenAPI spec file for documentation")
	.requiredOption(
		"-s, --spec <path>",
		"Path to the OpenAPI spec file (YAML or JSON)",
	)
	.option(
		"-o, --output <folder>",
		"Output folder for generated spec file",
		"public/specs",
	)
	.option(
		"-f --file <filename>",
		"Name of the generated spec file",
		"openapi.json",
	)
	.action(async (options) => {
		try {
			const specPath = path.resolve(process.cwd(), options.spec);
			console.log(`Reading spec file from: ${specPath}`);

			const content = await readFile(specPath, "utf8");
			const parsedContent = parseSpecFile(content);

			const openApiDoc = await parser.parse(parsedContent);
			console.log("Parsed OpenAPI Document:", openApiDoc);

			const sidebarData = await transformOpenApiToSidebar(openApiDoc);
			console.log("Generated Sidebar Data:", sidebarData);

			const outputFolder = path.resolve(process.cwd(), options.output);
			const mkdirOptions: MakeDirectoryOptions = { recursive: true };
			await mkdir(outputFolder, mkdirOptions);

			const outputFileName = options.file;
			const outputPath = path.join(outputFolder, outputFileName);

			const writeOpts: ObjectEncodingOptions = { encoding: "utf8" };
			await writeFile(
				outputPath,
				JSON.stringify(openApiDoc, null, 2),
				writeOpts,
			);

			console.log(`Parsed spec saved to: ${outputPath}`);
			console.log("Documentation generated successfully!");
		} catch (error: unknown) {
			console.error(
				"Error while generating documentation:",
				error instanceof Error ? error.message : String(error),
			);
			process.exit(1);
		}
	});

program.parse();

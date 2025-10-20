#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [_node, _script, packageName, version] = process.argv;

if (!packageName || !version) {
	console.error("Usage: node scripts/version.ts <package-name> <version>");
	process.exit(1);
}

const packagePath = join("packages", packageName, "package.json");

try {
	const pkg = JSON.parse(readFileSync(packagePath, "utf8"));
	pkg.version = version;
	writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);
	console.log(`✅ Updated ${packageName} to version ${version}`);
} catch (error) {
	console.error(`❌ Error: Could not update ${packagePath}`);
	console.error(error);
	process.exit(1);
}

import { useState } from "react";
import { CodeBlock } from "./code-block";
import { CodeLine } from "./code-line";

const packages = [
	{
		name: "@docutopia/react",
		description: 
			"Our react package is perfect for client-side react applications.",
		steps: [
			{
				title: "Install the package",
				description: "Choose the package that fits your stack",
				code: "npm install @docutopia/react",
				type: "install",
			},
			{
				title:  "Use it in your application",
				description: "Import the component and render it at root.",
				code: `import { Docutopia } from '@docutopia/react';

function App() {
  return (
    <Docutopia
      specUrl="https://petstore3.swagger.io/api/v3/openapi. json"
    />
  );
}`,
				type: "code",
			},
		],
	},
	{
		name: "@docutopia/nextjs",
		description: 
			"The NextJs package offers server-side rendering out of the box.",
		steps: [
			{
				title: "Install the package",
				description: "Choose the package that fits your stack",
				code: "npm install @docutopia/nextjs",
				type: "install",
			},
			{
				title: "Create the file in the right route",
				description: "Inside the 'app' folder, create the file 'docs/[[... slug]]/page.tsx'",
				code: `root/
  app/
    docs/
      [[...slug]]/
        page. tsx`,
				type: "text",
			},
			{
				title: "Use the component inside page.tsx",
				description: "Import the component and render.",
				code: `// app/docs/[[...slug]]/page. tsx
import { Docutopia } from "@docutopia/nextjs";

export default function DocsPage() {
  return (
    <Docutopia
      specUrl="https://petstore3.swagger.io/api/v3/openapi. json"
    />
  );
}`,
				type: "code",
			},
		],
	},
	{
		name: "@docutopia/fastify",
		description:  "Even easier documentation for Fastify users.",
		steps: [
			{
				title: "Install the package",
				description: "Choose the package that fits your stack",
				code: "npm install @docutopia/fastify",
				type: "install",
			},
			{
				title: "Add our plugin to server.ts",
				description: "Set up with little documentation",
				code: `import docutopia from "@docutopia/fastify";
import fastify from "fastify";
import spec from "./openapi-spec.json";

async function buildServer() {
  const server = fastify();

  // Register Docutopia plugin with custom configuration
  await server. register(docutopia, {
    routePrefix: "/docs",
    swagger: {
      openapi: spec,
    },
  });

  // ...Register your API routes
  return server;
}

async function start() {
  try {
    const server = await buildServer();

    await server.listen({
      port: 3001,
      host: "0.0.0.0",
    });
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
}

start();`,
				type: "code",
			},
		],
	},
	{
		name: "Use our CDN",
		description: "Quick integration without any build step.",
		steps: [
			{
				title: "Install the package",
				description: "Choose the package that fits your stack",
				code: '<script src="https://cdn.docutopia.io/v1/docutopia. js"></script>',
				type: "install",
			},
			{
				title: "Use it in your application",
				description: "Import the component and render it",
				code: `<div id="docutopia"></div>
<script>
  Docutopia.init({
    el: "#docutopia",
    specUrl: "https://petstore3.swagger.io/api/v3/openapi.json"
  });
</script>`,
				type: "code",
			},
		],
	},
];

export default function PackageSelector() {
	const [selected, setSelected] = useState(0);
	const currentPackage = packages[selected];
	const stepCount = currentPackage.steps.length;

	const gridClass = stepCount === 3 
		? "grid-cols-1 lg:grid-cols-3" 
		: "grid-cols-1 lg:grid-cols-2";

	return (
		<section className="px-8 py-16 bg-black">
			<div className="max-w-7xl mx-auto">
				<h2 className="text-4xl font-bold text-white mb-4">
					A different package for
					<br />
					different needs.
				</h2>
				<p className="text-xl text-gray-400 mb-8">
					{currentPackage.description}
				</p>
				<div className="flex flex-wrap gap-4 mb-12">
					{packages.map((pkg, index) => (
						<button
							key={index}
							onClick={() => setSelected(index)}
							className={`px-6 py-3 rounded-lg font-fira-code font-medium min-w-[200px] text-center transition-all duration-300 ease-out ${
								selected === index
									?  "bg-white text-black"
									: "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 hover:text-white hover: border-gray-600"
							}`}
						>
							{pkg.name}
						</button>
					))}
				</div>
				<div className={`grid ${gridClass} gap-6`}>
					{currentPackage.steps.map((step, index) => (
						<div key={index}>
							<h3 className="text-2xl font-bold text-white mb-4">
								{index + 1}. {step.title}
							</h3>
							<p className="text-gray-400 mb-4">
								{step.description}
							</p>
							<div className=" border border-gray-800 rounded-lg p-6 font-mono text-sm overflow-x-auto">
								{step.type === "install" ? (
								<CodeLine code={step.code} />
								) : step.type === "text" ? (
								<pre className="text-gray-400 text-xs">{step.code}</pre>
								) : (
								<CodeBlock code={step.code} lang="js" />
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
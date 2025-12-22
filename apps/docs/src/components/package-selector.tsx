import { useState } from "react";
import { CodeBlock } from "./code-block";
import { CodeLine } from "./code-line";

const packages = [
	{
		name: "@docutopia/react",
		steps: [
			{
				title: "Install the package",
				description: "Use your preferred package manager:",
				code: `npm install @docutopia/react`,
				type: "install",
			},
			{
				title: "Use it in your application",
				code: `import { Docutopia } from '@docutopia/react';
import '@docutopia/react/dist/style.css';

function App() {
  return (
    <Docutopia
      specUrl="https://petstore3.swagger.io/api/v3/openapi.json"
    />
  );
}

export default App;`,
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
				description: "The NextJs package offers server-side rendering out of the box.",
				code: "npm install @docutopia/nextjs",
				type: "install",
			},
			{
				title: "Use the component inside page.tsx",
				description: "Import the component and render.",
				code: `// app/docs/[[...slug]]/page.tsx
import { Docutopia } from "@docutopia/nextjs";

export default function DocsPage() {
  return (
    <Docutopia
      specUrl="https://petstore3.swagger.io/api/v3/openapi.json"
    />
  );
}`,
				type: "code",
			},
		],
	},
	{
		name: "@docutopia/fastify",
		steps: [
			{
				title: "Install the package",
				description: "Even easier documentation for Fastify users",
				code: "npm install @docutopia/fastify",
				type: "install",
			},
			{
				title: "Add our plugin to server.ts",
				description: "Set up with little documentation",
				code: `import docutopia from '@docutopia/fastify';
import fastify from 'fastify';

const server = fastify();

// Register Docutopia plugin
await server.register(docutopia, {
  routePrefix: '/docs',

});

await server.listen({ port: 3000 });`,
				type: "code",
			},
		],
	},
	{
		name: "CDN",
		steps: [
			{
				title: "Include the CDN scripts & styles",
				description: "Add these to your HTML <head> and before </body>",
				code:
					`//Add these to your <head> and right before </body>
  <link rel="stylesheet" href="https://unpkg.com/@docutopia/react/dist/browser/docutopia.css"/>

//Add these before closing body:
  <script src="https://unpkg.com/@docutopia/react/dist/browser/docutopia.js"></script>
`,
				type: "code",
			},
			{
				title: "Add our plugin to server.ts",
				description: "Set up with little documentation",
				code: `<script>
  Docutopia.render('docs', {
    specUrl: 'https://petstore3.swagger.io/api/v3/openapi.json',
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
		<section className="px-8 py-16 bg-black mt-0 lg:mt-[-60px]">
			<div className="max-w-7xl mx-auto">
				<h2 className="text-4xl font-bold text-white mb-4">
					A different package for
					<br />
					different needs.
				</h2>
				<p className="text-xl text-gray-400 mb-8">
					Use your preferred package manager:
				</p>
				<div className="flex flex-wrap gap-[10px] mb-12">
					{packages.map((pkg, index) => (
						<button
							key={index}
							onClick={() => setSelected(index)}
							className={`w-[220px] h-[52px] px-4 rounded-xl font-fira-code font-medium text-base text-center cursor-pointer transition-all duration-200 border border-[#8F8F8F] ${selected === index
								? "bg-white text-black"
								: "bg-[#0A0A0A] text-white hover:bg-[#1a1a1a] hover:text-white"
								}`}
							style={{ margin: 0 }}
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
							<div className="border border-gray-800 rounded-lg p-6 font-mono text-sm overflow-x-auto bg-black relative">
								{step.type === "install" ? (
									<CodeLine code={step.code} lang="bash" showCopy={index === 0} />
								) : step.type === "text" ? (
									<pre className="text-gray-400 text-xs">{step.code}</pre>
								) : (
									<CodeBlock code={step.code} lang="js" showCopy={index === 0} />
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
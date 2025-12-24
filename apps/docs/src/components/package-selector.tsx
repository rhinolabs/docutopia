import { useState } from "react";
import { CodeBlock } from "./code-block";
import { CodeLine } from "./code-line";

const packages = [
	{
		name: "@docutopia/react",
		steps: [
			{
				id: "react-install",
				title: "Install the package",
				description:
					"Our react package is perfect for client-side react applications.",
				code: "npm install @docutopia/react",
				type: "install",
			},
			{
				id: "react-usage",
				title: "Use it in your application",
				description: "Import the component and render it at root.",
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
		steps: [
			{
				id: "next-install",
				title: "Install the package",
				description:
					"The NextJs package offers server-side rendering out of the box.",
				code: "npm install @docutopia/nextjs",
				type: "install",
			},
			{
				id: "next-usage",
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
				id: "fastify-install",
				title: "Install the package",
				description: "Even easier documentation for Fastify users",
				code: "npm install @docutopia/fastify",
				type: "install",
			},
			{
				id: "fastify-usage",
				title: "Add our plugin to server.ts",
				description: "Set up with little documentation",
				code: `import docutopia from '@docutopia/fastify';
import fastify from 'fastify';

const server = fastify();

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
				id: "cdn-include",
				title: "Include the CDN scripts & styles",
				description: "Use this for simplest setup - no build tools needed",
				code: `<!-- Add to <head> -->
<link
  rel="stylesheet"
  href="https://unpkg.com/@docutopia/react/dist/browser/docutopia.css"
/>

<!-- Before </body> -->
<script src="https://unpkg.com/@docutopia/react/dist/browser/docutopia.js"></script>`,
				type: "code",
			},
			{
				id: "cdn-init",
				title: "Initialize Docutopia",
				description: "Render the documentation",
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

	return (
		<section id="how-to-use" className="bg-black pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 lg:pb-24">
			<div className="max-w-7xl mx-auto px-4 sm:px-8">
				{/* TITLE */}
				<h2
					className="
            text-2xl
            sm:text-3xl
            lg:text-4xl
            font-bold
            text-white
            leading-tight
            mb-4
          "
				>
					A different package for
					<br className="hidden sm:block" />
					different needs.
				</h2>

				<p className="text-base sm:text-lg text-gray-400 mb-10">
					Use your preferred package manager:
				</p>

				{/* PACKAGE TABS */}
				<div
					className="
            grid grid-cols-2 gap-3 mb-12
            sm:flex sm:flex-row sm:gap-4
          "
				>
					{packages.map((pkg, index) => (
						<button
							type="button"
							key={pkg.name}
							onClick={() => setSelected(index)}
							className={`w-full sm:w-[200px]
                px-3 py-2 sm:px-4 sm:py-3
                sm:h-[48px]
                rounded-xl
                font-fira-code
                text-xs sm:text-sm md:text-base
                leading-tight
                text-center
                whitespace-nowrap
                border
                transition
                cursor-pointer
                ${
									selected === index
										? "bg-white text-black border-white"
										: "bg-[#0A0A0A] text-white border-[#373737] hover:bg-[#1a1a1a]"
								}
              `}
						>
							{pkg.name}
						</button>
					))}
				</div>

				{/* STEPS */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{currentPackage.steps.map((step, index) => (
						<div key={step.id}>
							<h3
								className="
                  text-lg
                  sm:text-xl
                  lg:text-2xl
                  font-bold
                  text-white
                  mb-3
                "
							>
								{index + 1}. {step.title}
							</h3>

							<p
								className="
                  text-sm
                  sm:text-base
                  text-gray-400
                  mb-4
                  leading-relaxed
                "
							>
								{step.description}
							</p>

							<div className="relative border border-[#373737] rounded-xl bg-black p-4 sm:p-6">
								{step.type === "install" ? (
									<CodeLine
										code={step.code}
										lang="bash"
										showCopy={index === 0}
									/>
								) : (
									<CodeBlock
										code={step.code}
										lang="js"
										showCopy={index === 0}
									/>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

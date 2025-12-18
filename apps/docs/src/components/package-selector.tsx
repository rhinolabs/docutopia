import { useState } from "react";
import {CodeBlock} from "./code-block";
import {CodeLine} from "./code-line";

const packages = [
  {
    name: "@docutopia/react",
    install: "npm install @docutopia/react",
    usage:  `import { Docutopia } from '@docutopia/react';

function App() {
  return (
    <Docutopia
      specUrl="https://petstore3.swagger.io/api/v3/openapi.json"
    />
  );
}`,
    description: "Our react package is perfect for client-side react applications."
  },
  {
    name: "@docutopia/nextjs",
    install: "npm install @docutopia/nextjs",
    usage: `// app/docs/[[...slug]]/page.tsx
import { Docutopia } from "@docutopia/nextjs";

export default function DocsPage() {
  return (
    <Docutopia
      specUrl="https://petstore3.swagger.io/api/v3/openapi.json"
    />
  );
}`,
    description: "The NextJs package offers server-side rendering out of the box."
  },
  {
    name: "@docutopia/fastify",
    install: "npm install @docutopia/fastify",
    usage: `import docutopia from "@docutopia/fastify";
import fastify from "fastify";

async function buildServer() {
  const server = fastify();
  await server.register(docutopia, {
    routePrefix: "/docs",
    swagger: { openapi: spec },
  });
  return server;
}`,
    description: "Even easier documentation for Fastify users."
  },
  {
    name: "Use our CDN",
    install: '<script src="https://cdn.docutopia.io/v1/docutopia.js"></script>',
    usage: `<div id="docutopia"></div>
<script>
  Docutopia.init({
    el: "#docutopia",
    specUrl: "https://petstore3.swagger.io/api/v3/openapi.json"
  });
</script>`,
    description: "Quick integration without any build step."
  }
];

export default function PackageSelector() {
  const [selected, setSelected] = useState(0);

  return (
    <section className="px-8 py-16 bg-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-4">
          A different package for<br />different needs. 
        </h2>
        <p className="text-xl text-gray-400 mb-8">
          {packages[selected].description}
        </p>
        <div className="flex flex-wrap gap-4 mb-12">
          {packages.map((pkg, index) => (
            <button
              key={index}
              onClick={() => setSelected(index)}
              className={`px-6 py-3 rounded-lg font-fira-code font-medium transition ${
                selected === index
                  ? "bg-white text-black"
                  : "bg-gray-800 text-white hover: bg-gray-700 border border-gray-700"
              }`}
            >
              {pkg.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">1. Install the package</h3>
            <p className="text-gray-400 mb-4">Choose the package that fits your stack</p>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 font-mono text-sm overflow-x-auto">
              <CodeLine className="text-green-400" code={packages[selected].install} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">2. Use it in your application</h3>
            <p className="text-gray-400 mb-4">Import the component and render it</p>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 font-mono text-xs overflow-x-auto">
              <CodeBlock code={packages[selected].usage} /> 
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
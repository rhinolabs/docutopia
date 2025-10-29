# Docutopia

<p align="center">
  <img src="https://img.shields.io/npm/v/@docutopia/react" alt="npm version">
  <img src="https://img.shields.io/npm/l/@docutopia/react" alt="license">
  <img src="https://img.shields.io/github/stars/rhinolabs/docutopia" alt="github stars">
</p>

A modern, interactive API documentation library built on React. Docutopia brings beautiful, type-safe API documentation to your OpenAPI specifications with a focus on simplicity and developer experience.

## Overview

Docutopia simplifies creating beautiful API documentation by providing:

- **Modern React architecture** with clean, responsive UI
- **Interactive API testing** built directly into the documentation
- **Multiple authentication methods** (Bearer Token, API Key, Basic Auth)
- **Automatic cURL generation** for all API requests
- **Dark mode support** out of the box

## Packages

- [`@docutopia/react`](./packages/react/README.md) - React library with API documentation rendering
- [`@docutopia/fastify`](./packages/fastify/README.md) - Fastify plugin for serving Docutopia
- [`@docutopia/nextjs`](./packages/nextjs/README.md) - Next.js adapter for Docutopia

## Getting Started

Install the package:

```bash
npm install @docutopia/react
```

Use it in your application:

```jsx
import { Docutopia } from '@docutopia/react';

function App() {
  return (
    <Docutopia
      specUrl="https://petstore3.swagger.io/api/v3/openapi.json"
      baseUrl="https://petstore3.swagger.io" // optional
    />
  );
}
```

### Props

- **`specUrl`** (required) - URL to your OpenAPI specification
- **`baseUrl`** (optional) - Base URL for API requests. If not provided, uses the server URL from the OpenAPI spec

## Features

- **🎨 Beautiful UI** - Modern, responsive interface with dark mode support
- **🔄 Interactive Testing** - Test API endpoints directly in the documentation
- **🔐 Multiple Auth Methods** - Bearer Token, API Key, and Basic Auth support
- **📋 cURL Generation** - Export any request as a cURL command
- **📱 Responsive** - Works seamlessly on desktop and mobile

## Development

```bash
# Clone the repository
git clone https://github.com/rhinolabs/docutopia.git
cd docutopia

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run development mode
pnpm dev

# Run linting
pnpm lint
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

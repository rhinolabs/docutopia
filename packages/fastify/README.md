# @docutopia/fastify

Fastify plugin for [Docutopia](https://github.com/rhinolabs/docutopia) - A modern alternative to @fastify/swagger-ui.

<p align="center">
  <img src="https://img.shields.io/npm/v/@docutopia/fastify" alt="npm version">
  <img src="https://img.shields.io/npm/l/@docutopia/fastify" alt="license">
  <img src="https://img.shields.io/github/stars/rhinolabs/docutopia" alt="github stars">
</p>

## Features

- **🎨 Beautiful UI** - Modern, interactive documentation interface
- **🔄 Interactive Testing** - Test API endpoints directly in the browser
- **📋 Auto-generated** - Automatically generated from your Fastify routes
- **🔐 Multiple Auth Methods** - Bearer Token, API Key, and Basic Auth support

## Installation

```bash
npm install @docutopia/fastify
```

## Quick Start

```typescript
import docutopia from '@docutopia/fastify';
import fastify from 'fastify';

const server = fastify();

// Register Docutopia plugin
await server.register(docutopia, {
  routePrefix: '/docs',
  swagger: {
    openapi: {
      info: {
        title: 'My API',
        description: 'API documentation',
        version: '1.0.0',
      },
    },
  },
});

await server.listen({ port: 3000 });
```

Visit `http://localhost:3000/docs` to see your documentation.

## Options

### `routePrefix` (optional)

- **Type:** `string`
- **Default:** `"/documentation"`
- **Description:** URL prefix for the documentation routes

### `swagger` (optional)

- **Type:** `SwaggerOptions`
- **Description:** Configuration for @fastify/swagger. If @fastify/swagger is not already registered, it will be registered automatically with this configuration.

```typescript
await server.register(docutopia, {
  routePrefix: '/docs',
  swagger: {
    openapi: {
      info: {
        title: 'My API',
        version: '1.0.0',
      },
    },
  },
});
```

## How It Works

The plugin automatically:
1. Registers @fastify/swagger if not already registered
2. Serves the Docutopia UI at the specified route prefix
3. Exposes the OpenAPI spec at `{routePrefix}/json`

## License

MIT

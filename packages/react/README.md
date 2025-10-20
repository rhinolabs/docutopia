# @docutopia/react

A modern, interactive API documentation library built with React. Docutopia transforms your OpenAPI specifications into beautiful, interactive documentation with built-in testing capabilities.

<p align="center">
  <img src="https://img.shields.io/npm/v/@docutopia/react" alt="npm version">
  <img src="https://img.shields.io/npm/l/@docutopia/react" alt="license">
  <img src="https://img.shields.io/github/stars/rhinolabs/docutopia" alt="github stars">
</p>

## Features

- **🎨 Beautiful UI** - Clean, modern interface with dark mode support
- **🔄 Interactive Testing** - Built-in "Try It!" panel to test endpoints directly in the documentation
- **🔐 Multiple Auth Methods** - Support for Bearer Token, API Key, and Basic Authentication
- **📋 cURL Generation** - Automatically generate cURL commands for any request
- **📱 Responsive** - Works seamlessly on desktop and mobile devices

## Installation

```bash
# Using npm
npm install @docutopia/react

# Using pnpm
pnpm add @docutopia/react

# Using yarn
yarn add @docutopia/react
```

## Quick Start

```jsx
import { Docutopia } from '@docutopia/react';
import '@docutopia/react/dist/style.css';

function App() {
  return (
    <Docutopia specUrl="https://petstore3.swagger.io/api/v3/openapi.json" />
  );
}

export default App;
```

## Props

### `specUrl` (required)

- **Type:** `string`
- **Description:** URL to your OpenAPI specification (JSON or YAML format)

```jsx
<Docutopia specUrl="https://api.example.com/openapi.json" />
```

That's it! Docutopia handles everything else automatically.

## Framework Integration

### Next.js

```jsx
// app/docs/page.tsx
'use client';

import { Docutopia } from '@docutopia/react';
import '@docutopia/react/dist/style.css';

export default function DocsPage() {
  return <Docutopia specUrl="/api/openapi.json" />;
}
```

### Remix

```jsx
// app/routes/docs.tsx
import { Docutopia } from '@docutopia/react';
import '@docutopia/react/dist/style.css';

export default function DocsRoute() {
  return <Docutopia specUrl="/api/openapi.json" />;
}
```

### Vite

```jsx
// src/App.jsx
import { Docutopia } from '@docutopia/react';
import '@docutopia/react/dist/style.css';

function App() {
  return <Docutopia specUrl="https://api.example.com/openapi.json" />;
}
```

## License

MIT

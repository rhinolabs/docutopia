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

## Usage

### React

```jsx
import { Docutopia } from '@docutopia/react';
import '@docutopia/react/dist/style.css';

function App() {
  return (
    <Docutopia
      specUrl="https://petstore3.swagger.io/api/v3/openapi.json"
      baseUrl="https://petstore3.swagger.io"
    />
  );
}

export default App;
```

### Browser (IIFE)

For projects without a build system, use the standalone browser bundle via CDN.

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/@docutopia/react/dist/browser/docutopia.css">
</head>
<body>
  <div id="docs"></div>
  <script src="https://unpkg.com/@docutopia/react/dist/browser/docutopia.js"></script>
  <script>
    Docutopia.render('docs', {
      specUrl: 'https://petstore3.swagger.io/api/v3/openapi.json',
      baseUrl: 'https://petstore3.swagger.io' // optional
    });
  </script>
</body>
</html>
```

#### `Docutopia.render(elementId, config)`

Renders the documentation to a DOM element.

- **elementId** (`string`): The ID of the container element
- **config** (`object`):
  - `specUrl` (`string`): URL to your OpenAPI specification
  - `baseUrl` (`string`): Base URL for API requests

## Props

### `specUrl` (required)

- **Type:** `string`
- **Description:** URL to your OpenAPI specification (JSON or YAML format)

### `baseUrl` (optional)

- **Type:** `string`
- **Description:** Base URL for API requests. If not provided, uses the server URL from the OpenAPI spec

## License

MIT

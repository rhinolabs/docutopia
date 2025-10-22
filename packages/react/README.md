# @docutopia/react

A modern, interactive API documentation library - The beautiful alternative to Swagger UI.

## Installation

```bash
npm install @docutopia/react
# or
pnpm add @docutopia/react
# or
yarn add @docutopia/react
```

## Usage

```tsx
import { Docutopia } from '@docutopia/react';
import '@docutopia/react/styles';

function App() {
  return (
    <Docutopia
      specUrl="https://petstore3.swagger.io/api/v3/openapi.json"
      baseUrl="https://petstore3.swagger.io"
    />
  );
}
```

## Props

### `specUrl` (required)

URL to the OpenAPI specification (JSON or YAML format).

- Type: `string`

### `baseUrl` (required)

Base URL for the API endpoints.

- Type: `string`

### `className` (optional)

Additional CSS classes to apply to the root container.

- Type: `string`

### `basename` (optional)

Custom router basename for nested routing.

- Type: `string`

## Features

- 🎨 Beautiful, modern UI with dark mode
- 🔍 Interactive API exploration
- 🧪 Built-in API testing ("Try It" feature)
- 🔐 Multiple authentication methods (Bearer, API Key, Basic Auth)
- 📝 Full TypeScript support
- ⚡ Fast and lightweight
- 🎯 OpenAPI 3.0 compliant

## License

MIT

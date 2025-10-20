# Docutopia

A modern, interactive API documentation library built on React. Docutopia brings beautiful, type-safe API documentation to your OpenAPI specifications with a focus on simplicity and developer experience.

## Monorepo Structure

This project is structured as a monorepo using pnpm workspaces:

- **`packages/react`** - React library package (`@docutopia/react`)
  The main Docutopia library that renders interactive API documentation from OpenAPI specifications with built-in testing capabilities.

## Overview

Docutopia simplifies creating beautiful API documentation by providing:

- **Modern React architecture** with clean, responsive UI
- **Interactive API testing** built directly into the documentation
- **Multiple authentication methods** (Bearer Token, API Key, Basic Auth)
- **Automatic cURL generation** for all API requests
- **Dark mode support** out of the box

## Getting Started

The fastest way to use Docutopia is to install it in your project:

```bash
# Install the package
npm install @docutopia/react

# Or with pnpm
pnpm add @docutopia/react

# Or with yarn
yarn add @docutopia/react
```

Then import and use it in your application:

```jsx
import { Docutopia } from '@docutopia/react';
import '@docutopia/react/dist/style.css';

function App() {
  return (
    <Docutopia specUrl="https://petstore3.swagger.io/api/v3/openapi.json" />
  );
}
```

For more detailed instructions, check the package documentation:

- [`@docutopia/react`](./packages/react/README.md) - React library with API documentation rendering

## Key Features

### 🎨 Beautiful UI

Modern, clean interface with dark mode support by default:

```jsx
<Docutopia specUrl="https://api.example.com/openapi.json" />
```

That's it! Docutopia automatically renders:
- Organized endpoint navigation by tags
- Request/response schemas with examples
- Interactive parameter fields
- Response visualization

### 🔄 Interactive Testing

Built-in "Try It!" panel for testing endpoints directly:

- Dynamic form generation from OpenAPI schemas
- Support for path, query, and body parameters
- Real-time request/response display
- Automatic validation based on schemas

### 🔐 Authentication Support

Configure authentication credentials right in the UI:

- **Bearer Token** - JWT and other token-based auth
- **API Key** - Custom header or query parameter keys
- **Basic Auth** - Username/password authentication

Authentication is automatically applied to all requests with proper headers.

### 📋 cURL Generation

Every request can be exported as a cURL command:

```bash
curl -X GET "https://api.example.com/users/123" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json"
```

Perfect for sharing API examples or debugging.

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

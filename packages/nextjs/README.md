# @docutopia/nextjs

Next.js adapter for [Docutopia](https://github.com/rhinolabs/docutopia) - A modern, interactive API documentation library.

<p align="center">
  <img src="https://img.shields.io/npm/v/@docutopia/nextjs" alt="npm version">
  <img src="https://img.shields.io/npm/l/@docutopia/nextjs" alt="license">
  <img src="https://img.shields.io/github/stars/rhinolabs/docutopia" alt="github stars">
</p>

## Installation

```bash
npm install @docutopia/nextjs
```

## Quick Start

### 1. Create the catch-all route

Create a file at `app/docs/[[...slug]]/page.tsx`:

```tsx
import { Docutopia } from '@docutopia/nextjs';

export default function DocsPage() {
  return (
    <Docutopia
      specUrl="/api/openapi.json"
      baseUrl="http://localhost:3000"
    />
  );
}
```

### 2. Serve your OpenAPI spec

Create an API route at `app/api/openapi/route.ts`:

```tsx
import { NextResponse } from 'next/server';

export async function GET() {
  // Load your OpenAPI spec from file or external URL
  const spec = await fetch('https://your-api.com/openapi.json');
  const data = await spec.json();

  return NextResponse.json(data);
}
```

### 3. Access your documentation

Visit `http://localhost:3000/docs` to see your API documentation.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `specUrl` | `string` | Yes | URL to the OpenAPI specification (JSON or YAML) |
| `baseUrl` | `string` | No | Base URL for API requests. If not provided, uses the server URL from the OpenAPI spec |
| `className` | `string` | No | Additional CSS classes for the root container |

## Notes

- The `[[...slug]]` route pattern is a Next.js catch-all route that handles all documentation pages
- The `'use client'` directive is required for Next.js App Router compatibility

## License

MIT

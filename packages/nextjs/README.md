# @docutopia/nextjs

Next.js adapter for [Docutopia](https://github.com/rhinolabs/docutopia) - A modern, interactive API documentation library.

## Installation

```bash
npm install @docutopia/nextjs
# or
pnpm add @docutopia/nextjs
# or
yarn add @docutopia/nextjs
```

## Quick Start

### 1. Create the catch-all route

Create a file at `app/docs/[[...slug]]/page.tsx`:

```tsx
import { Docutopia } from '@docutopia/nextjs';
import '@docutopia/nextjs/styles';

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
| `baseUrl` | `string` | Yes | Base URL for API endpoint requests |
| `className` | `string` | No | Additional CSS classes for the root container |

## File Structure

For a typical setup:

```
app/
├── docs/
│   └── [[...slug]]/
│       └── page.tsx          # Docutopia component
└── api/
    └── openapi/
        └── route.ts          # Serve OpenAPI spec
```

The `[[...slug]]` is a Next.js catch-all route that captures:
- `/docs` - Welcome page
- `/docs/get-pet-by-id` - Specific endpoint documentation

## Advanced Usage

### Custom Styling

You can apply custom styles using the `className` prop:

```tsx
<Docutopia
  specUrl="/api/openapi.json"
  baseUrl="http://localhost:3000"
  className="max-w-7xl mx-auto p-4"
/>
```

### Dynamic OpenAPI Specs

You can load different specs based on route parameters:

```tsx
// app/docs/[project]/[[...slug]]/page.tsx
import { Docutopia } from '@docutopia/nextjs';
import '@docutopia/nextjs/styles';

export default function ProjectDocsPage({
  params,
}: {
  params: { project: string };
}) {
  return (
    <Docutopia
      specUrl={`/api/${params.project}/openapi.json`}
      baseUrl={`https://${params.project}.api.example.com`}
    />
  );
}
```

## How It Works

`@docutopia/nextjs` is a pre-configured wrapper around `@docutopia/react` that:

1. **Automatically configures routing** for Next.js App Router
2. **Re-exports everything** from `@docutopia/react`
3. **Provides the `NextJSAdapter`** for seamless integration

You don't need to manually configure routing adapters - it's all handled for you.

## Differences from @docutopia/react

| Feature | @docutopia/react | @docutopia/nextjs |
|---------|------------------|-------------------|
| Routing | React Router (manual) | Next.js App Router (automatic) |
| Setup | Configure `ReactRouterAdapter` | Just import and use |
| Dependencies | `react-router-dom` | `next` |

## TypeScript Support

Full TypeScript support with type definitions included.

```tsx
import type { DocutopiaProps } from '@docutopia/nextjs';

const props: DocutopiaProps = {
  specUrl: '/api/openapi.json',
  baseUrl: 'http://localhost:3000',
};
```

## License

MIT

## Links

- [Documentation](https://github.com/rhinolabs/docutopia)
- [GitHub](https://github.com/rhinolabs/docutopia)
- [npm](https://www.npmjs.com/package/@docutopia/nextjs)

# Next.js App Router Example

This is an example application demonstrating how to use `@docutopia/nextjs` with Next.js App Router.

## Features

- ✅ Next.js 15 App Router
- ✅ React 19
- ✅ TypeScript
- ✅ Tailwind CSS 4
- ✅ Dark mode by default
- ✅ Petstore OpenAPI example

## Getting Started

### 1. Install dependencies

From the root of the monorepo:

```bash
pnpm install
```

### 2. Build the packages

```bash
pnpm build
```

### 3. Run the development server

```bash
cd examples/nextjs-app
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

- Homepage: `http://localhost:3000`
- API Docs: `http://localhost:3000/docs`

## Project Structure

```
examples/nextjs-app/
├── app/
│   ├── api/
│   │   └── openapi/
│   │       └── route.ts          # Serves OpenAPI spec
│   ├── docs/
│   │   └── [[...slug]]/
│   │       └── page.tsx          # Docutopia component
│   ├── globals.css               # Global styles + Tailwind
│   ├── layout.tsx                # Root layout with dark mode
│   └── page.tsx                  # Homepage
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
└── package.json
```

## Key Files

### `app/docs/[[...slug]]/page.tsx`

The main documentation page using Docutopia:

```tsx
import { Docutopia } from "@docutopia/nextjs";
import "@docutopia/nextjs/styles";

export default function DocsPage() {
  return (
    <Docutopia
      specUrl="https://petstore3.swagger.io/api/v3/openapi.json"
      baseUrl="https://petstore3.swagger.io"
    />
  );
}
```

### `app/layout.tsx`

Root layout with dark mode enabled:

```tsx
<html lang="en" className="dark">
```

## Using Your Own OpenAPI Spec

### Option 1: Direct URL

```tsx
<Docutopia
  specUrl="https://your-api.com/openapi.json"
  baseUrl="https://your-api.com"
/>
```

### Option 2: API Route (Recommended)

1. Update `app/api/openapi/route.ts` to serve your spec
2. Use the local API route:

```tsx
<Docutopia
  specUrl="/api/openapi"
  baseUrl="https://your-api.com"
/>
```

## Learn More

- [Docutopia Documentation](https://github.com/rhinolabs/docutopia)
- [Next.js Documentation](https://nextjs.org/docs)
- [@docutopia/nextjs Package](../../packages/nextjs/README.md)

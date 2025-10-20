# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Docutopia is a modern, interactive API documentation library built on React. It renders beautiful, type-safe OpenAPI specifications with built-in interactive testing capabilities. Think of it as a modern alternative to Swagger UI.

## Monorepo Structure

This is a pnpm workspace monorepo:

- **`packages/react`** - Main library package (`@docutopia/react`) - The React component that renders interactive API documentation from OpenAPI specs

## Development Commands

```bash
# Install dependencies
pnpm install

# Build all packages (required before testing changes)
pnpm build

# Development mode with hot reload
pnpm dev

# Type checking
pnpm tsc

# Linting
pnpm lint
pnpm lint:fix

# Preview built version
pnpm preview
```

### Working with packages/react

```bash
# Development mode for react package only
pnpm --filter @docutopia/react dev

# Build react package only
pnpm --filter @docutopia/react build
```

## Code Architecture

### OpenAPI Spec URL

The OpenAPI specification URL is currently hardcoded in `app.tsx`:
- Located in the `App` component as `specUrl`
- Currently set to: `https://petstore3.swagger.io/api/v3/openapi.json`
- **Future Enhancement**: This should be converted to a prop to allow dynamic spec URLs

### State Management (Zustand)

The application uses Zustand for global state with three main stores:

1. **`openapi-store.ts`** - Manages OpenAPI spec loading and endpoint selection
   - Loads and parses OpenAPI specifications from remote URLs
   - Provides operation lookup by slug
   - Handles loading states and errors

2. **`auth-store.ts`** - Manages authentication credentials with localStorage persistence
   - Supports: Bearer Token, API Key (header/query), Basic Auth, Cookie
   - Generates auth headers and query params for API requests
   - Persists credentials across sessions using zustand/persist

3. **`request-params-store.ts`** - Manages request parameters for the "Try It" feature
   - Handles path, query, and body parameters
   - Supports nested object and array parameters

### Core Services

- **`OpenApiService`** - Fetches and transforms OpenAPI specs
  - Loads specs from URLs
  - Finds operations by slug (generated from operationId/summary/path)

- **`ApiClient`** - Generic HTTP client for API requests
  - Handles query parameters, headers, and body
  - Automatically applies authentication from auth-store
  - Includes timeout and error handling

### Component Architecture

**Sidebar Navigation:**
- `AppSidebar` → `SidebarContent` → `NavMain`
- Organizes endpoints by OpenAPI tags
- Generates slugs for endpoint URLs

**Endpoint Documentation:**
- `EndpointDocumentation` - Main documentation display (left column)
  - `EndpointHeader` - Shows method, path, and description
  - `EndpointParams` - Displays parameters (path/query/body)
  - `EndpointResponses` - Shows response schemas and examples

**Try It Panel:**
- `TryApiPanel` - Interactive API testing panel (right column)
  - `EnhancedCredentialsForm` - Auth configuration
  - `ParamsHandler` → `DynamicFields` → `FieldRenderer` - Parameter inputs
  - `ResponseDisplay` - Shows API responses
  - `EnhancedCurlDisplay` - Generates cURL commands

### Field System (Dynamic Forms)

The field system uses a registry pattern for type-safe parameter inputs:

- **Registry** (`utils/fields/field-registry.ts`): Maps OpenAPI schema types to React components
- **Field Components** (`components/ui/fields/`):
  - `StringField` - text, email, date, etc.
  - `IntegerField` - number inputs
  - `ArrayField` - arrays with add/remove items
  - `ObjectField` - nested objects
  - `UnsupportedField` - fallback for unknown types

- **Mapping** (`utils/fields/map-schema-to-param-field.ts`): Converts OpenAPI schemas to field configurations

### OpenAPI Parsing

- **Parser** (`utils/api/parser/`):
  - `parseSpecFile.ts` - Main parser entry point
  - `processors.ts` - Processes paths, operations, parameters
  - `validators.ts` - Validates OpenAPI structure
  - `errors.ts` - Custom error types

- **Reference Resolution** (`utils/api/resolve-ref.ts`): Resolves `$ref` pointers in OpenAPI specs

### Routing

Uses React Router with dynamic routes:
- `/` - Welcome page (no endpoint selected)
- `/:apiUrl` - Endpoint documentation page (apiUrl is the operation slug)

Slugs are generated using `@sindresorhus/slugify` from `operationId` or `summary` or `path`, ensuring URL-safe, lowercase identifiers with hyphens.

## Key Patterns

### Adding a New Field Type

1. Create component in `components/ui/fields/`
2. Implement the field interface with `field`, `name`, `readOnly`, `paramType`, `bodyPath` props
3. Register in `utils/fields/field-registry.ts`
4. Update `map-schema-to-param-field.ts` if needed

### Adding Authentication Methods

1. Update `AuthCredentials` type in `core/types/`
2. Add defaults in `auth-store.ts` → `authTypeDefaults`
3. Implement header/query generation in `generateAuthHeaders`/`generateAuthQuery`
4. Update `CredentialsForm` UI

### Working with OpenAPI Schemas

- All types are in `types/api/openapi/`
- Use `resolveRef()` to handle `$ref` pointers
- Operations are "enhanced" with `path` and `method` fields when passed to components
- Parameter locations: `path`, `query`, `header`, `cookie`

## Tech Stack

- **React 19** with TypeScript
- **Rsbuild** - Build tool (faster Webpack alternative)
- **Zustand** - State management with localStorage persistence
- **React Router** - Client-side routing
- **Tailwind CSS 4** - Styling
- **@rhinolabs/ui** - UI component library
- **@sindresorhus/slugify** - URL slug generation
- **Biome** - Linting and formatting (tabs, double quotes)
- **pnpm** - Package manager

## Code Style

- **Indentation**: Tabs (enforced by Biome)
- **Quotes**: Double quotes (enforced by Biome)
- **Imports**: Organized automatically by Biome
- **TypeScript**: Strict mode enabled
- **Path Aliases**: `@/` maps to `packages/react/src/`

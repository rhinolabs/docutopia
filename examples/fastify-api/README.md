# Fastify API Example with Docutopia

This example demonstrates how to use `@docutopia/fastify` to add beautiful, interactive API documentation to your Fastify application.

## Features

- ✨ Complete CRUD API with Users and Products endpoints
- 📖 Interactive API documentation powered by Docutopia
- 🔍 OpenAPI 3.0 specification with detailed schemas
- 🚀 Hot reload development mode
- 💾 Mock in-memory database
- 🎯 Full TypeScript support

## Quick Start

### Install Dependencies

From the monorepo root:

```bash
pnpm install
```

### Run the Example

```bash
# From the monorepo root
pnpm --filter fastify-api-example dev

# Or from this directory
pnpm dev
```

The server will start on port **3001** with the following endpoints:

- 📖 **API Documentation**: http://localhost:3001/docs
- 🔧 **OpenAPI Spec**: http://localhost:3001/docs/json
- 💚 **Health Check**: http://localhost:3001/health

## API Endpoints

### Users

- `GET /api/users` - Get all users (supports filtering by role)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PATCH /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

### Products

- `GET /api/products` - Get all products (supports filtering by category, price, stock)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create a new product
- `PATCH /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product
- `POST /api/products/:id/stock` - Update product stock

### Health

- `GET /health` - Server health check

## Try It Out

1. Open http://localhost:3001/docs in your browser
2. Browse the available endpoints in the sidebar
3. Click on any endpoint to see its documentation
4. Use the "Try It" panel on the right to test endpoints interactively
5. Configure authentication if needed using the credentials form

## Example Requests

### Get all users

```bash
curl http://localhost:3001/api/users
```

### Get users with specific role

```bash
curl http://localhost:3001/api/users?role=admin
```

### Create a new user

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Johnson","email":"alice@example.com","role":"user"}'
```

### Get all products in stock

```bash
curl http://localhost:3001/api/products?inStock=true
```

### Filter products by category and price

```bash
curl "http://localhost:3001/api/products?category=electronics&maxPrice=500"
```

### Update product stock

```bash
curl -X POST http://localhost:3001/api/products/1/stock \
  -H "Content-Type: application/json" \
  -d '{"quantity":-5}'
```

## Configuration

The Docutopia plugin is configured in `src/server.ts`:

```typescript
await server.register(docutopia, {
  routePrefix: "/docs",
  swagger: {
    openapi: {
      info: {
        title: "Example API",
        description: "A sample Fastify API demonstrating Docutopia documentation",
        version: "1.0.0",
      },
      servers: [
        {
          url: `http://localhost:${PORT}`,
          description: "Development server",
        },
      ],
      tags: [
        {
          name: "users",
          description: "User management operations",
        },
        {
          name: "products",
          description: "Product catalog operations",
        },
      ],
    },
  },
});
```

## Project Structure

```
examples/fastify-api/
├── src/
│   ├── routes/
│   │   ├── users.ts        # User CRUD endpoints
│   │   └── products.ts     # Product CRUD endpoints
│   └── server.ts           # Main server setup
├── package.json
├── tsconfig.json
└── README.md
```

## How It Works

1. **@fastify/swagger** generates the OpenAPI specification from route schemas
2. **@docutopia/fastify** plugin serves the Docutopia UI at `/docs`
3. The UI fetches the spec from `/docs/json` and renders interactive documentation
4. Each route includes detailed OpenAPI schemas for parameters, request bodies, and responses

## Learn More

- [Docutopia Documentation](https://github.com/rhinolabs/docutopia)
- [Fastify Documentation](https://fastify.dev/)
- [@fastify/swagger Documentation](https://github.com/fastify/fastify-swagger)
- [OpenAPI Specification](https://swagger.io/specification/)

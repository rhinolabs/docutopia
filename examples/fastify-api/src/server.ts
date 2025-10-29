import docutopia from "@docutopia/fastify";
import cors from "@fastify/cors";
import fastify from "fastify";
import { productsRoutes } from "./routes/products.js";
import { usersRoutes } from "./routes/users.js";

const PORT = 3001;
const HOST = "0.0.0.0";

async function buildServer() {
	const server = fastify({
		logger: true,
	});

	// Enable CORS for all origins (adjust in production)
	await server.register(cors, {
		origin: true,
	});

	// Register Docutopia plugin with custom configuration
	await server.register(docutopia, {
		routePrefix: "/docs",
		swagger: {
			openapi: {
				info: {
					title: "Example API",
					description:
						"A sample Fastify API demonstrating Docutopia documentation",
					version: "1.0.0",
					contact: {
						name: "API Support",
						email: "support@example.com",
					},
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

	// Register API routes
	await server.register(usersRoutes, { prefix: "/api" });
	await server.register(productsRoutes, { prefix: "/api" });

	// Health check endpoint
	server.get(
		"/health",
		{
			schema: {
				description: "Health check endpoint",
				tags: ["health"],
				response: {
					200: {
						type: "object",
						properties: {
							status: { type: "string" },
							timestamp: { type: "string" },
						},
					},
				},
			},
		},
		async () => {
			return {
				status: "ok",
				timestamp: new Date().toISOString(),
			};
		},
	);

	return server;
}

async function start() {
	try {
		const server = await buildServer();

		await server.listen({
			port: PORT,
			host: HOST,
		});

		console.log("\n🚀 Server is running!");
		console.log(`📖 API Documentation: http://localhost:${PORT}/docs`);
		console.log(`🔧 OpenAPI Spec: http://localhost:${PORT}/docs/json`);
		console.log(`💚 Health Check: http://localhost:${PORT}/health\n`);
	} catch (err) {
		console.error("Error starting server:", err);
		process.exit(1);
	}
}

start();

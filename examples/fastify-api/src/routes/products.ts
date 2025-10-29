import type { FastifyInstance } from "fastify";

// Mock database
const products = [
	{
		id: 1,
		name: "Laptop Pro 15",
		description: "High-performance laptop with 16GB RAM",
		price: 1299.99,
		category: "electronics",
		stock: 45,
		createdAt: "2024-01-10T08:00:00Z",
	},
	{
		id: 2,
		name: "Wireless Mouse",
		description: "Ergonomic wireless mouse with precision tracking",
		price: 29.99,
		category: "electronics",
		stock: 150,
		createdAt: "2024-01-11T08:00:00Z",
	},
	{
		id: 3,
		name: "Office Chair",
		description: "Comfortable ergonomic office chair",
		price: 249.99,
		category: "furniture",
		stock: 20,
		createdAt: "2024-01-12T08:00:00Z",
	},
	{
		id: 4,
		name: "Standing Desk",
		description: "Adjustable height standing desk",
		price: 499.99,
		category: "furniture",
		stock: 12,
		createdAt: "2024-01-13T08:00:00Z",
	},
];

// Schema definitions
const productSchema = {
	type: "object",
	properties: {
		id: { type: "number", description: "Product ID" },
		name: { type: "string", description: "Product name" },
		description: { type: "string", description: "Product description" },
		price: {
			type: "number",
			minimum: 0,
			description: "Product price in USD",
		},
		category: {
			type: "string",
			enum: ["electronics", "furniture", "clothing", "books"],
			description: "Product category",
		},
		stock: {
			type: "number",
			minimum: 0,
			description: "Available stock quantity",
		},
		createdAt: {
			type: "string",
			format: "date-time",
			description: "Product creation timestamp",
		},
	},
	required: ["id", "name", "price", "category", "stock"],
};

const createProductSchema = {
	type: "object",
	properties: {
		name: {
			type: "string",
			minLength: 3,
			maxLength: 100,
			description: "Product name",
		},
		description: {
			type: "string",
			maxLength: 500,
			description: "Product description",
		},
		price: {
			type: "number",
			minimum: 0.01,
			description: "Product price in USD",
		},
		category: {
			type: "string",
			enum: ["electronics", "furniture", "clothing", "books"],
			description: "Product category",
		},
		stock: {
			type: "number",
			minimum: 0,
			default: 0,
			description: "Initial stock quantity",
		},
	},
	required: ["name", "price", "category"],
};

const errorSchema = {
	type: "object",
	properties: {
		error: { type: "string" },
		message: { type: "string" },
	},
};

export async function productsRoutes(fastify: FastifyInstance) {
	// Get all products
	fastify.get(
		"/products",
		{
			schema: {
				description: "Retrieve a list of products with optional filtering",
				tags: ["products"],
				querystring: {
					type: "object",
					properties: {
						category: {
							type: "string",
							enum: ["electronics", "furniture", "clothing", "books"],
							description: "Filter by product category",
						},
						minPrice: {
							type: "number",
							minimum: 0,
							description: "Minimum price filter",
						},
						maxPrice: {
							type: "number",
							minimum: 0,
							description: "Maximum price filter",
						},
						inStock: {
							type: "boolean",
							description: "Filter only products in stock",
						},
						limit: {
							type: "number",
							minimum: 1,
							maximum: 100,
							default: 10,
							description: "Maximum number of products to return",
						},
					},
				},
				response: {
					200: {
						type: "object",
						properties: {
							products: {
								type: "array",
								items: productSchema,
							},
							total: { type: "number" },
						},
					},
				},
			},
		},
		async (request) => {
			const {
				category,
				minPrice,
				maxPrice,
				inStock,
				limit = 10,
			} = request.query as {
				category?: string;
				minPrice?: number;
				maxPrice?: number;
				inStock?: boolean;
				limit?: number;
			};

			let filteredProducts = products;

			if (category) {
				filteredProducts = filteredProducts.filter(
					(p) => p.category === category,
				);
			}

			if (minPrice !== undefined) {
				filteredProducts = filteredProducts.filter((p) => p.price >= minPrice);
			}

			if (maxPrice !== undefined) {
				filteredProducts = filteredProducts.filter((p) => p.price <= maxPrice);
			}

			if (inStock) {
				filteredProducts = filteredProducts.filter((p) => p.stock > 0);
			}

			return {
				products: filteredProducts.slice(0, limit),
				total: filteredProducts.length,
			};
		},
	);

	// Get product by ID
	fastify.get(
		"/products/:id",
		{
			schema: {
				description: "Retrieve a specific product by ID",
				tags: ["products"],
				params: {
					type: "object",
					properties: {
						id: { type: "number", description: "Product ID" },
					},
					required: ["id"],
				},
				response: {
					200: productSchema,
					404: errorSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as { id: number };
			const product = products.find((p) => p.id === Number(id));

			if (!product) {
				reply.code(404);
				return {
					error: "Not Found",
					message: `Product with ID ${id} not found`,
				};
			}

			return product;
		},
	);

	// Create new product
	fastify.post(
		"/products",
		{
			schema: {
				description: "Create a new product",
				tags: ["products"],
				body: createProductSchema,
				response: {
					201: productSchema,
					400: errorSchema,
				},
			},
		},
		async (request, reply) => {
			const body = request.body as {
				name: string;
				description?: string;
				price: number;
				category: string;
				stock?: number;
			};

			const newProduct = {
				id: products.length + 1,
				name: body.name,
				description: body.description || "",
				price: body.price,
				category: body.category,
				stock: body.stock || 0,
				createdAt: new Date().toISOString(),
			};

			products.push(newProduct);
			reply.code(201);
			return newProduct;
		},
	);

	// Update product
	fastify.patch(
		"/products/:id",
		{
			schema: {
				description: "Update an existing product",
				tags: ["products"],
				params: {
					type: "object",
					properties: {
						id: { type: "number", description: "Product ID" },
					},
					required: ["id"],
				},
				body: {
					type: "object",
					properties: {
						name: { type: "string", minLength: 3, maxLength: 100 },
						description: { type: "string", maxLength: 500 },
						price: { type: "number", minimum: 0.01 },
						category: {
							type: "string",
							enum: ["electronics", "furniture", "clothing", "books"],
						},
						stock: { type: "number", minimum: 0 },
					},
				},
				response: {
					200: productSchema,
					404: errorSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as { id: number };
			const updates = request.body as Partial<{
				name: string;
				description: string;
				price: number;
				category: string;
				stock: number;
			}>;

			const productIndex = products.findIndex((p) => p.id === Number(id));

			if (productIndex === -1) {
				reply.code(404);
				return {
					error: "Not Found",
					message: `Product with ID ${id} not found`,
				};
			}

			products[productIndex] = { ...products[productIndex], ...updates };
			return products[productIndex];
		},
	);

	// Delete product
	fastify.delete(
		"/products/:id",
		{
			schema: {
				description: "Delete a product",
				tags: ["products"],
				params: {
					type: "object",
					properties: {
						id: { type: "number", description: "Product ID" },
					},
					required: ["id"],
				},
				response: {
					204: {
						type: "null",
						description: "Product successfully deleted",
					},
					404: errorSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as { id: number };
			const productIndex = products.findIndex((p) => p.id === Number(id));

			if (productIndex === -1) {
				reply.code(404);
				return {
					error: "Not Found",
					message: `Product with ID ${id} not found`,
				};
			}

			products.splice(productIndex, 1);
			reply.code(204);
			return null;
		},
	);

	// Update product stock
	fastify.post(
		"/products/:id/stock",
		{
			schema: {
				description: "Update product stock quantity",
				tags: ["products"],
				params: {
					type: "object",
					properties: {
						id: { type: "number", description: "Product ID" },
					},
					required: ["id"],
				},
				body: {
					type: "object",
					properties: {
						quantity: {
							type: "number",
							description:
								"Stock quantity to add (positive) or remove (negative)",
						},
					},
					required: ["quantity"],
				},
				response: {
					200: productSchema,
					400: errorSchema,
					404: errorSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as { id: number };
			const { quantity } = request.body as { quantity: number };

			const productIndex = products.findIndex((p) => p.id === Number(id));

			if (productIndex === -1) {
				reply.code(404);
				return {
					error: "Not Found",
					message: `Product with ID ${id} not found`,
				};
			}

			const newStock = products[productIndex].stock + quantity;

			if (newStock < 0) {
				reply.code(400);
				return {
					error: "Bad Request",
					message: "Insufficient stock available",
				};
			}

			products[productIndex].stock = newStock;
			return products[productIndex];
		},
	);
}

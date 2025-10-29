import type { FastifyInstance } from "fastify";

// Mock database
const users = [
	{
		id: 1,
		name: "John Doe",
		email: "john@example.com",
		role: "admin",
		createdAt: "2024-01-15T10:00:00Z",
	},
	{
		id: 2,
		name: "Jane Smith",
		email: "jane@example.com",
		role: "user",
		createdAt: "2024-01-16T10:00:00Z",
	},
	{
		id: 3,
		name: "Bob Johnson",
		email: "bob@example.com",
		role: "user",
		createdAt: "2024-01-17T10:00:00Z",
	},
];

// Schema definitions
const userSchema = {
	type: "object",
	properties: {
		id: { type: "number", description: "User ID" },
		name: { type: "string", description: "User's full name" },
		email: {
			type: "string",
			format: "email",
			description: "User's email address",
		},
		role: {
			type: "string",
			enum: ["admin", "user"],
			description: "User's role",
		},
		createdAt: {
			type: "string",
			format: "date-time",
			description: "Account creation timestamp",
		},
	},
	required: ["id", "name", "email", "role"],
};

const createUserSchema = {
	type: "object",
	properties: {
		name: { type: "string", minLength: 2, description: "User's full name" },
		email: {
			type: "string",
			format: "email",
			description: "User's email address",
		},
		role: {
			type: "string",
			enum: ["admin", "user"],
			default: "user",
			description: "User's role",
		},
	},
	required: ["name", "email"],
};

const errorSchema = {
	type: "object",
	properties: {
		error: { type: "string" },
		message: { type: "string" },
	},
};

export async function usersRoutes(fastify: FastifyInstance) {
	// Get all users
	fastify.get(
		"/users",
		{
			schema: {
				description: "Retrieve a list of all users",
				tags: ["users"],
				querystring: {
					type: "object",
					properties: {
						role: {
							type: "string",
							enum: ["admin", "user"],
							description: "Filter users by role",
						},
						limit: {
							type: "number",
							minimum: 1,
							maximum: 100,
							default: 10,
							description: "Maximum number of users to return",
						},
					},
				},
				response: {
					200: {
						type: "object",
						properties: {
							users: {
								type: "array",
								items: userSchema,
							},
							total: { type: "number" },
						},
					},
				},
			},
		},
		async (request) => {
			const { role, limit = 10 } = request.query as {
				role?: string;
				limit?: number;
			};

			let filteredUsers = users;
			if (role) {
				filteredUsers = users.filter((u) => u.role === role);
			}

			return {
				users: filteredUsers.slice(0, limit),
				total: filteredUsers.length,
			};
		},
	);

	// Get user by ID
	fastify.get(
		"/users/:id",
		{
			schema: {
				description: "Retrieve a specific user by ID",
				tags: ["users"],
				params: {
					type: "object",
					properties: {
						id: {
							type: "number",
							description: "User ID",
						},
					},
					required: ["id"],
				},
				response: {
					200: userSchema,
					404: errorSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as { id: number };
			const user = users.find((u) => u.id === Number(id));

			if (!user) {
				reply.code(404);
				return {
					error: "Not Found",
					message: `User with ID ${id} not found`,
				};
			}

			return user;
		},
	);

	// Create new user
	fastify.post(
		"/users",
		{
			schema: {
				description: "Create a new user",
				tags: ["users"],
				body: createUserSchema,
				response: {
					201: userSchema,
					400: errorSchema,
				},
			},
		},
		async (request, reply) => {
			const body = request.body as {
				name: string;
				email: string;
				role?: string;
			};

			// Check if email already exists
			const existingUser = users.find((u) => u.email === body.email);
			if (existingUser) {
				reply.code(400);
				return {
					error: "Bad Request",
					message: "User with this email already exists",
				};
			}

			const newUser = {
				id: users.length + 1,
				name: body.name,
				email: body.email,
				role: (body.role as "admin" | "user") || "user",
				createdAt: new Date().toISOString(),
			};

			users.push(newUser);
			reply.code(201);
			return newUser;
		},
	);

	// Update user
	fastify.patch(
		"/users/:id",
		{
			schema: {
				description: "Update an existing user",
				tags: ["users"],
				params: {
					type: "object",
					properties: {
						id: { type: "number", description: "User ID" },
					},
					required: ["id"],
				},
				body: {
					type: "object",
					properties: {
						name: { type: "string", minLength: 2 },
						email: { type: "string", format: "email" },
						role: { type: "string", enum: ["admin", "user"] },
					},
				},
				response: {
					200: userSchema,
					404: errorSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as { id: number };
			const updates = request.body as Partial<{
				name: string;
				email: string;
				role: string;
			}>;

			const userIndex = users.findIndex((u) => u.id === Number(id));

			if (userIndex === -1) {
				reply.code(404);
				return {
					error: "Not Found",
					message: `User with ID ${id} not found`,
				};
			}

			users[userIndex] = { ...users[userIndex], ...updates };
			return users[userIndex];
		},
	);

	// Delete user
	fastify.delete(
		"/users/:id",
		{
			schema: {
				description: "Delete a user",
				tags: ["users"],
				params: {
					type: "object",
					properties: {
						id: { type: "number", description: "User ID" },
					},
					required: ["id"],
				},
				response: {
					204: {
						type: "null",
						description: "User successfully deleted",
					},
					404: errorSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as { id: number };
			const userIndex = users.findIndex((u) => u.id === Number(id));

			if (userIndex === -1) {
				reply.code(404);
				return {
					error: "Not Found",
					message: `User with ID ${id} not found`,
				};
			}

			users.splice(userIndex, 1);
			reply.code(204);
			return null;
		},
	);
}

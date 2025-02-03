import type { OpenApiDocument } from "@/types/api/openapi";

export const mockOpenApiDoc: OpenApiDocument = {
	openapi: "3.0.0",
	info: {
		title: "Docutopia API",
		version: "1.0.0",
		description: "API mock for documentation purposes",
	},
	servers: [
		{
			url: "https://api.hyphen.ai/api",
		},
	],
	tags: [
		{ name: "API Keys", description: "Operations for API key management" },
		{ name: "Access", description: "Access control operations" },
	],
	paths: {
		"/organizations/{organizationId}/access": {
			get: {
				summary: "Get a list of access for an organization",
				tags: ["Access"],
				parameters: [
					{
						name: "organizationId",
						in: "path",
						required: true,
						schema: {
							type: "string",
							pattern: "^org_[a-fA-F0-9]{24}$",
						},
						description: "The ID of the organization.",
					},
					{
						name: "pageNum",
						in: "query",
						required: false,
						schema: {
							type: "integer",
							minimum: 1,
							default: 1,
						},
						description: "The page number.",
					},
					{
						in: "query",
						name: "pageSize",
						required: false,
						schema: {
							type: "integer",
							minimum: 5,
							maximum: 200,
							default: 50,
						},
						description: "The page size.",
					},
					{
						in: "query",
						name: "entityIds",
						required: false,
						schema: {
							type: "array",
							items: {
								type: "string",
							},
						},
						description: "The entity Ids.",
					},
					{
						in: "query",
						name: "assignmentIds",
						required: true,
						schema: {
							type: "array",
							items: {
								type: "string",
								enum: [
									"OrganizationAdmin",
									"OrganizationMember",
									"TeamOwner",
									"TeamMember",
									"ProjectOwner",
									"ProjectCollaborator",
									"ProjectViewer",
									"LinkCodeOwner",
								],
							},
						},
						description: "The assignment Ids.",
					},
				],
				responses: {
					"200": {
						description:
							"Successfully got a list of access for an organization",
						content: {},
					},
					"401": {
						description: "Unauthorized",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/DefaultErrorSchema" },
							},
						},
					},
					"404": {
						description: "Not Found",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/DefaultErrorSchema" },
							},
						},
					},
					"500": {
						description: "Internal Server Error",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/DefaultErrorSchema" },
							},
						},
					},
				},
			},
			post: {
				summary: "Create access for an organization",
				tags: ["Access"],
				parameters: [
					{
						name: "organizationId",
						in: "path",
						required: true,
						schema: {
							type: "string",
							pattern: "^org_[a-fA-F0-9]{24}$",
						},
						description: "The ID of the organization.",
					},
				],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									entity: {
										type: "object",
										properties: {
											type: {
												type: "string",
												description: "The entity type.",
												enum: ["Organization", "LinkCode", "Project", "Team"],
											},
											id: {
												type: "string",
												description: "The entity id.",
											},
										},
										required: ["type", "id"],
									},
									roles: {
										type: "array",
										description: "The assigned roles.",
										items: {
											type: "string",
											description: "The role assigned to the entity.",
											enum: [
												"OrganizationAdmin",
												"OrganizationMember",
												"TeamOwner",
												"TeamMember",
												"ProjectOwner",
												"ProjectCollaborator",
												"ProjectViewer",
												"LinkCodeOwner",
											],
										},
									},
									assignment: {
										type: "object",
										properties: {
											type: {
												type: "string",
												description: "The entity type.",
												enum: ["Organization", "LinkCode", "Project", "Team"],
											},
											id: {
												type: "string",
												description: "The entity id.",
												pattern: "^org_[a-fA-F0-9]{24}$",
											},
										},
										required: ["type", "id"],
									},
								},
								required: ["entity", "roles"],
							},
						},
					},
				},
				responses: {
					"200": {
						description:
							"Successfully got a list of access for an organization",
						content: {},
					},
					"401": {
						description: "Unauthorized",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/DefaultErrorSchema" },
							},
						},
					},
					"404": {
						description: "Not Found",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/DefaultErrorSchema" },
							},
						},
					},
					"500": {
						description: "Internal Server Error",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/DefaultErrorSchema" },
							},
						},
					},
				},
			},
		},
	},
	components: {
		schemas: {
			DefaultErrorSchema: {
				type: "object",
				required: ["message", "requestId", "errorCode"],
				properties: {
					message: { type: "string" },
					requestId: { type: "string" },
					errorCode: { type: "string" },
					errors: {
						type: "array",
						items: { type: "string" },
					},
				},
			},
		},
	},
};

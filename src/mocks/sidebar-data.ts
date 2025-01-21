import type { SidebarCollection } from "@/types/sidebar";

export const mockSidebarData: { navMain: SidebarCollection[] } = {
	navMain: [
		{
			collectionName: "Docutopia API",
			requests: [
				{
					name: "API Keys",
					url: "/",
					isActive: true,
					items: [
						{
							name: "Get list of API keys for an organization",
							url: "get-keys-list-for-organization",
							requestType: "GET",
						},
						{
							name: "Create an API key for an organization",
							url: "create-api-key-for-organization",
							requestType: "POST",
						},
						{
							name: "Get an API key for an organization",
							url: "get-api-key-for-organization",
							requestType: "GET",
						},
						{
							name: "Delete an API key for organization",
							url: "delete-api-key-for-organization",
							requestType: "DELETE",
						},
						{
							name: "Create a secret for API key",
							url: "create-secret-key-for-api-key",
							requestType: "PUT",
						},
						{
							name: "Delete a secret for an API key",
							url: "delete-secret-key-for-api-key",
							requestType: "DELETE",
						},
					],
				},
				{
					name: "Access",
					url: "#",
					items: [
						{
							name: "Sub Menu Item 1",
							url: "#",
							requestType: "PUT",
						},
						{
							name: "Sub Menu Item 2",
							url: "#",
							requestType: "PUT",
						},
					],
				},
				{
					name: "Domains",
					url: "#",
					items: [
						{
							name: "Sub Menu Item 1",
							url: "#",
							requestType: "PUT",
						},
						{
							name: "Sub Menu Item 2",
							url: "#",
							requestType: "PUT",
						},
					],
				},
				{
					name: "Integrations",
					url: "#",
					items: [
						{
							name: "Sub Menu Item 1",
							url: "#",
							requestType: "PUT",
						},
					],
				},
				{
					name: "Project Environments",
					url: "#",
					items: [
						{
							name: "Sub Menu Item 1",
							url: "#",
							requestType: "PUT",
						},
					],
				},
			],
		},
		{
			collectionName: "Docutopia ENV API",
			requests: [
				{
					name: "Personal Life Management",
					url: "/",
					items: [
						{
							name: "Get list of API keys for an organization",
							url: "#",
							requestType: "GET",
						},
					],
				},
				{
					name: "Professional Development",
					url: "/",
					items: [
						{
							name: "Get list of API keys for an organization",
							url: "#",
							requestType: "GET",
						},
					],
				},
				{
					name: "Creative Projects",
					url: "/",
					items: [
						{
							name: "Get list of API keys for an organization",
							url: "#",
							requestType: "GET",
						},
					],
				},
				{
					name: "Home Management",
					url: "/",
					items: [
						{
							name: "Get list of API keys for an organization",
							url: "#",
							requestType: "GET",
						},
					],
				},
			],
		},
	],
};

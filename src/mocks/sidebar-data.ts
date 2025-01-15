import type { SidebarCollection } from "@/types/sidebar";

export const mockSidebarData: { navMain: SidebarCollection[] } = {
	navMain: [
		{
			collectionName: "Docutopia API",
			requests: [
				{
					title: "API Keys",
					url: "/",
					isActive: true,
					items: [
						{
							title: "Get list of API keys for an organization",
							url: "#",
							requestType: "GET",
						},
						{
							title: "Create an API key for an organization",
							url: "#",
							requestType: "POST",
						},
						{
							title: "Get an API key for an organization",
							url: "#",
							requestType: "GET",
						},
						{
							title: "Delete an API key for organization",
							url: "#",
							requestType: "DELETE",
						},
						{
							title: "Create a secret for API key",
							url: "#",
							requestType: "PUT",
						},
						{
							title: "Delete a secret for an API key",
							url: "#",
							requestType: "DELETE",
						},
					],
				},
				{
					title: "Access",
					url: "#",
					items: [
						{
							title: "Sub Menu Item 1",
							url: "#",
							requestType: "PUT",
						},
						{
							title: "Sub Menu Item 2",
							url: "#",
							requestType: "PUT",
						},
					],
				},
				{
					title: "Domains",
					url: "#",
					items: [
						{
							title: "Sub Menu Item 1",
							url: "#",
							requestType: "PUT",
						},
						{
							title: "Sub Menu Item 2",
							url: "#",
							requestType: "PUT",
						},
					],
				},
				{
					title: "Integrations",
					url: "#",
					items: [
						{
							title: "Sub Menu Item 1",
							url: "#",
							requestType: "PUT",
						},
					],
				},
				{
					title: "Project Environments",
					url: "#",
					items: [
						{
							title: "Sub Menu Item 1",
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
					title: "Personal Life Management",
					url: "/",
					items: [
						{
							title: "Get list of API keys for an organization",
							url: "#",
							requestType: "GET",
						},
					],
				},
				{
					title: "Professional Development",
					url: "/",
					items: [
						{
							title: "Get list of API keys for an organization",
							url: "#",
							requestType: "GET",
						},
					],
				},
				{
					title: "Creative Projects",
					url: "/",
					items: [
						{
							title: "Get list of API keys for an organization",
							url: "#",
							requestType: "GET",
						},
					],
				},
				{
					title: "Home Management",
					url: "/",
					items: [
						{
							title: "Get list of API keys for an organization",
							url: "#",
							requestType: "GET",
						},
					],
				},
			],
		},
	],
};

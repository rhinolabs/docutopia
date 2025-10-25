import { NextResponse } from "next/server";

/**
 * API route that serves the OpenAPI specification
 * This proxies the Petstore OpenAPI spec for demonstration purposes
 */
export async function GET() {
	try {
		const response = await fetch(
			"https://petstore3.swagger.io/api/v3/openapi.json",
		);

		if (!response.ok) {
			return NextResponse.json(
				{ error: "Failed to fetch OpenAPI spec" },
				{ status: 500 },
			);
		}

		const spec = await response.json();

		return NextResponse.json(spec, {
			headers: {
				"Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
			},
		});
	} catch (error) {
		console.error("Error fetching OpenAPI spec:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

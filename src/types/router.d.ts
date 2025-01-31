import "@tanstack/react-router";
import type { RouteParams } from "@/routes/__root";

declare module "@tanstack/react-router" {
	interface RouteParams {
		api_url: string;
	}
}

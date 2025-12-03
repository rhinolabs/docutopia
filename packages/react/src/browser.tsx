import { createRoot } from "react-dom/client";
import { Docutopia } from "./docutopia";
import "./index.css";
import type { OpenApiDocument } from "@/types/api/openapi";

export interface DocutopiaRenderConfig {
	specUrl?: string;
	spec?: OpenApiDocument;
	baseUrl: string;
}

/**
 * Render Docutopia to a DOM element
 */
export function render(elementId: string, config: DocutopiaRenderConfig): void {
	const element = document.getElementById(elementId);
	if (!element) {
		throw new Error(`Docutopia: Element with id "${elementId}" not found`);
	}

	const root = createRoot(element);
	root.render(<Docutopia {...config} />);
}

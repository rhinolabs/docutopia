import { createRoot } from "react-dom/client";
import { Docutopia } from "./docutopia";

export { Docutopia } from "./docutopia";
export { App } from "./app";
import './index.css';

/**
 * Render Docutopia to a container element
 * This is the browser entry point for standalone usage
 */
export function renderDocutopia(
	container: HTMLElement,
	props: {
		specUrl: string;
		baseUrl: string;
		basename?: string;
	},
) {
	const root = createRoot(container);
	root.render(<Docutopia {...props} />);
	return root;
}

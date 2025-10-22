import { createRoot } from "react-dom/client";
import { Docutopia, DocutopiaProps } from "./docutopia";
import "./index.css";

/**
 * Initialize Docutopia in the browser
 * This is the entry point for the UMD bundle
 */
export function init(
	elementId: string,
	props: DocutopiaProps,
): { unmount: () => void } {
	const element = document.getElementById(elementId);
	if (!element) {
		throw new Error(`Element with id "${elementId}" not found`);
	}

	const root = createRoot(element);
	root.render(<Docutopia {...props} />);

	return {
		unmount: () => root.unmount(),
	};
}

// Also export the component for advanced usage
export { Docutopia } from "./docutopia";
export type { DocutopiaProps } from "./docutopia";

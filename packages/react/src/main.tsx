import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app";

import "./index.css";

// Set dark mode as default
document.documentElement.classList.add("dark");

createRoot(document.getElementById("root") as HTMLElement).render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
);

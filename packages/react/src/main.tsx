import { createRoot } from "react-dom/client";
import { Docutopia } from "./docutopia";

import "./index.css";

// Set dark mode as default
document.documentElement.classList.add("dark");

createRoot(document.getElementById("root") as HTMLElement).render(
	<Docutopia
		specUrl="./giant-spec.json"
		// specUrl="https://petstore3.swagger.io/api/v3/openapi.json"
		// baseUrl="https://petstore3.swagger.io"
	/>,
);

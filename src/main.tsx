import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { App } from "./App";
import { DocutopiaPage } from "./pages";

import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root") as HTMLElement).render(
	<QueryClientProvider client={queryClient}>
		<HashRouter>
			<Routes>
				<Route path="/" element={<App />}>
					<Route index element={<DocutopiaPage />} />
					<Route path=":apiUrl" element={<DocutopiaPage />} />
				</Route>
			</Routes>
		</HashRouter>
	</QueryClientProvider>,
);

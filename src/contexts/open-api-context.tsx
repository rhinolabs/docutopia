import type { SidebarCollection } from "@/types/components/sidebar";
import { transformOpenApiToSidebar } from "@/utils/api/openapi-adapter";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

import openapiData from "@/mocks/openapi.yaml";
import type { OpenApiDocument } from "@/types/api/openapi";

export interface OpenApiData {
	doc: OpenApiDocument;
	sidebar: SidebarCollection[];
}

const OpenApiContext = createContext<OpenApiData | null>(null);

export const OpenApiProvider = ({ children }: { children: ReactNode }) => {
	const [data, setData] = useState<OpenApiData | null>(null);

	useEffect(() => {
		async function loadData() {
			try {
				const sidebar = await transformOpenApiToSidebar(openapiData);
				setData({
					doc: openapiData as OpenApiDocument,
					sidebar,
				});
			} catch (error) {
				console.error("Error loading OpenAPI data:", error);
			}
		}
		loadData();
	}, []);

	if (!data) {
		return <div>Loading Documentation...</div>;
	}

	return (
		<OpenApiContext.Provider value={data}>{children}</OpenApiContext.Provider>
	);
};

export const useOpenApi = () => {
	const context = useContext(OpenApiContext);

	if (!context) {
		throw new Error("useOpenApi must be used within an OpenApiProvider");
	}

	return context;
};

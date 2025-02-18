import type { SidebarCollection } from "@/types/components/sidebar";
import { transformOpenApiToSidebar } from "@/utils/api/openapi-adapter";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

import type { OpenApiDocument } from "@/types/api/openapi";

interface OpenApiProviderProps {
	specPath: string;
	children: ReactNode;
}

export interface OpenApiData {
	doc: OpenApiDocument;
	sidebar: SidebarCollection[];
}

const OpenApiContext = createContext<OpenApiData | null>(null);

export const OpenApiProvider = ({
	specPath,
	children,
}: OpenApiProviderProps) => {
	const [data, setData] = useState<OpenApiData | null>(null);

	useEffect(() => {
		async function loadData() {
			try {
				const res = await fetch(specPath);

				if (!res.ok) {
					throw new Error(`Unable to fetch spec from ${specPath}`);
				}

				const oaData = await res.json();

				const sidebar = await transformOpenApiToSidebar(oaData);
				setData({
					doc: oaData,
					sidebar,
				});
			} catch (error) {
				console.error("Error loading OpenAPI data:", error);
			}
		}
		loadData();
	}, [specPath]);

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

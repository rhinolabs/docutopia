import { useMemo } from "react";
import { useOpenApiStore } from "@/stores/openapi-store";
import type { SidebarCollection } from "@/types/components/sidebar";

interface SidebarData {
	collections: SidebarCollection[];
	totalEndpoints: number;
	isLoading: boolean;
	error: string | null;
	specInfo: {
		title: string;
		version: string;
		serversCount: number;
	};
}

export const useSidebarData = (): SidebarData => {
	const { spec, isLoading, error } = useOpenApiStore();

	return useMemo(() => {
		if (isLoading) {
			return {
				collections: [],
				totalEndpoints: 0,
				isLoading: true,
				error: null,
				specInfo: null,
			};
		}

		if (error || !spec) {
			throw new Error(error || "No specification loaded");
		}

		const collections = spec.sidebar;
		const totalEndpoints = collections.reduce((total, collection) => {
			return (
				total +
				collection.requests.reduce((collectionTotal, request) => {
					return collectionTotal + (request.items ? request.items.length : 1);
				}, 0)
			);
		}, 0);

		return {
			collections,
			totalEndpoints,
			isLoading: false,
			error: null,
			specInfo: {
				title: spec.info.title,
				version: spec.info.version,
				serversCount: spec.servers.length,
			},
		};
	}, [spec, isLoading, error]);
};

import type { RequestType } from "@/types/api/Requests";

export interface SidebarRequestItem {
	name: string;
	url: string;
	requestType: RequestType;
}

export interface SidebarRequest {
	name: string;
	url: string;
	isActive?: boolean;
	items?: SidebarRequestItem[];
}

export interface SidebarCollection {
	collectionName: string;
	requests: SidebarRequest[];
}

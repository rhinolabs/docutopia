import type { Request } from "./api/requests";

export interface SidebarCollection {
	collectionName: string;
	requests: Request[];
}

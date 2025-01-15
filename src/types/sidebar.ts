import type { Request } from "./requests";

export interface SidebarCollection {
	collectionName: string;
	requests: Request[];
}

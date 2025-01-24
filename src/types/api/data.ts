import type { ApiParameter } from "./parameters";
import type { ApiResponse } from "./responses";

export interface ApiDataParsed {
	id: number;
	name: string;
	shortName?: string;
	groupName: string;
	requestType: string;
	url: string;
	parameters: ApiParameter[];
	response: ApiResponse[];
}

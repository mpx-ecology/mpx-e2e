import {ACTION_GET_DOM, ACTION_SCREENSHOT_ADDED, ACTION_ASSERTION_ADDED, ACTION_WAIT_FOR, ACTION_ROUTER_OPERATED } from "@/views/GenCase/menu";

export interface LOAD_CASE_RESPONSE {
	errno: number,
	errmsg: string,
	tasks: string[],
	preview: string,
	lineNums: Record<string, number>,
	minitestJson: Record<string, any>
}

export interface TYPE_CMD_BY_PLATFORM {
	command: string;
	cmdIndex: number|undefined;
	byPlatform: boolean;
	timestamp: number;
	action: string;
	data: {
		[key:string]: any
	}
}

export interface TYPE_SEMANTIC_ITEM {
	type: string;
	label: string;
	command: string | undefined;
	cmdIndex: number | undefined;
	text: string | undefined;
	tag: string | undefined;
	path: string | undefined;
	byPlatform: boolean;
}


export interface TYPE_ORIGIN_JSON {
	commands: any[]
}

export type MENU_TYPE = ACTION_GET_DOM | ACTION_SCREENSHOT_ADDED | ACTION_ASSERTION_ADDED | ACTION_WAIT_FOR | ACTION_ROUTER_OPERATED

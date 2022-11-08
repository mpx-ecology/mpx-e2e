import {ACTION_GET_DOM, ACTION_SCREENSHOT_ADDED, ACTION_ASSERTION_ADDED, ACTION_WAIT_FOR, ACTION_ROUTER_OPERATED } from "@/views/GenCase/menu";

export interface API_RESPONSE {
	errno: number;
	errmsg: string;
	[key:string]: any
}

export interface CMD_INTERFACE {
	command: string|undefined;
	cmdIndex: number|undefined;
}

export interface LOAD_CASE_RESPONSE extends API_RESPONSE{
	tasks: string[],
	preview: string,
	lineNums: Record<string, number>,
	minitestJson: Record<string, any>
}

export interface TYPE_CMD_BY_PLATFORM extends CMD_INTERFACE{
	byPlatform: boolean;
	timestamp: number;
	action: string;
	data: {
		[key:string]: any
	}
}

export interface TYPE_SEMANTIC_ITEM extends CMD_INTERFACE{
	type: string;
	label: string;
	text: string | undefined;
	tag: string | undefined;
	path: string | undefined;
	byPlatform: boolean;
}


export interface TYPE_ORIGIN_JSON {
	commands: any[]
}

export interface TYPE_MENU {
	cmdIndex: number;
	menuIdx: number;
	action: ACTION_GET_DOM;
	title: string;
}

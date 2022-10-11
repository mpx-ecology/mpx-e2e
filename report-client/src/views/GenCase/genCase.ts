import opType from './opType'

import type { opTypes } from './opType'

// interface cmdItem {
// 	command: opTypes,
// 	tagName?: string,
// 	target: string,
// 	extraData: string,
// 	text: string
// 	// expectContent: string,
// 	// expectTextLength: string,
// 	// expectRegExp: string,
// 	// expectApiName: string,
// 	// expectRouter: string,
// 	// waitTime: string,
// 	// responseContentPath: string,
// 	// expectElementHeight: string,
// 	// expectElementWidth: string
// }

export function cmdToLabel (cmds:Record<any, any>[]) {
	if (!cmds) return []
	return cmds.map((i) => {
		const { command } = i;
		const res = {
			type: 'operate',
			command,
			label: '',
			cmdIndex: i.cmdIndex,
			tag: i.tagName,
			path: i.path,
			text: i.text,
			byPlatform: i.byPlatform
		}
		console.log(command);
		const fun= opType[command as opTypes];
		res.label = fun(i as any);
		return res
	})
}

export function getMockRules (minitestJson: Record<any, any>) {
	if (!minitestJson || !Array.isArray(minitestJson.commands)) throw new TypeError('json.commands must be an Array');
	return minitestJson.commands.filter((i) => i.command === 'mock').map((i) => i.rule);
}

export function getCmds (commands: any[], excludeRules = []) {
	if (!commands || !Array.isArray(commands)) {
		console.warn('json.commands must be an Array');
		return []
	}
	const result:any[] = []
	commands.forEach((item, index) => {
		if (!['mock', 'startRecord', 'stopRecord', ...excludeRules].includes(item.command)) {
			result.push({
				cmdIndex: index,
				...item
			})
		}
	});
	return result
}

export function getMockedApisWithoutDuplicate (minitestJson: Record<any, any>) {
	return minitestJson?.env?.recordAPIs.length ? [...new Set(minitestJson.env.recordAPIs)] : [];
}

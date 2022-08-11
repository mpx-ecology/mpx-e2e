import opType from './opType'

import type { opTypes } from './opType'

interface cmdItem {
	command: opTypes,
	tagName?: string,
	target: string,
	extraData: string,
	text: string
	// expectContent: string,
	// expectTextLength: string,
	// expectRegExp: string,
	// expectApiName: string,
	// expectRouter: string,
	// waitTime: string,
	// responseContentPath: string,
	// expectElementHeight: string,
	// expectElementWidth: string
}

export function cmdToLabel (cmds:Record<any, any>[]) {
	return cmds.map(i => {
		let { command } = i;
		let res = {
			cmd: command,
			label: ''
		}
		let fun = opType[command as opTypes];
		switch (command) {
			case 'tap':
				res.label = fun(i.tagName + ' ' + i.text)
				break;
			case 'assertVisible':
				res.label = fun(i.target)
				break;
			case 'dataSnapshot':
				res.label = fun('');
				break;
			case 'wxmlSnapshot':
				res.label = fun('');
				break;
			case 'assertTextContent':
				res.label = fun(i.extraData);
				break;
			case 'assertTextLength':
				res.label = fun(i.extraData);
				break;
			case 'assertTextByRegExp':
				res.label = fun(i.extraData);
				break;
			case 'assertElementWidth':
				res.label = fun(i.extraData);
				break;
			case 'assertElementLength':
				res.label = fun(i.extraData);
				break;
			case 'assertResponseContent':
				res.label = fun(i.extraData);
				break;
			case 'waitForSomeTime':
				res.label = fun(i.extraData);
				break;
			case 'waitForExactRouter':
				res.label = fun(i.extraData);
				break;
			case 'waitForApiResponse':
				res.label = fun(i.extraData);
				break;
			case 'operateRouterRelaunch':
				res.label = fun('');
				break;
			case 'operateRouterBack':
				res.label = fun('');
				break;
			case 'operateRouterSwitchTab':
				res.label = fun('');
				break;
			case 'navigateLeft':
				res.label = fun('');
				break;
			case 'touchmove':
				res.label = fun(i.tagName + ' ' + i.text)
				break;
			case 'scroll':
				res.label = fun(i.tagName + ' ' + i.text)
		}
		return res
	})
}

export function getMockRules (minitestJson: Record<any, any>) {
	if (!minitestJson || !Array.isArray(minitestJson.commands)) throw new TypeError('json.commands must be an Array');
	return minitestJson.commands.filter((i) => i.command === 'mock').map((i) => i.rule);
}

export function getCmds (minitestJson: Record<any, any>, excludeRules = []) {
	if (!minitestJson || !Array.isArray(minitestJson.commands)) throw new TypeError('json.commands must be an Array');
	return minitestJson.commands.filter(i => !['mock', 'startRecord', 'stopRecord', ...excludeRules].includes(i.command));
}

export function getMockedApisWithoutDuplicate (minitestJson: Record<any, any>) {
	return minitestJson?.env?.recordAPIs.length ? [...new Set(minitestJson.env.recordAPIs)] : [];
}

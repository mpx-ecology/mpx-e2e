export const addPostFix = i => `${i}ByEnhanced`
export const ACTION_GET_DOM = addPostFix('getDOM')
export const ACTION_WAIT_FOR = addPostFix('waitFor')
export const ACTION_ASSERTION_ADDED = addPostFix('assertionAdded');
export const ACTION_ROUTER_OPERATED = addPostFix('routerOperated')
export const ACTION_SCREENSHOT_ADDED = addPostFix('screenshotAdded')

export const menus = [
	{
		title: '获取 DOM 元素',
		action: ACTION_GET_DOM
	},
	{
		title: '支持 WaitFor',
		action: ACTION_WAIT_FOR
	},
	{
		title: '新增断言',
		action: ACTION_ASSERTION_ADDED
	},
	{
		title: '操作路由',
		action: ACTION_ROUTER_OPERATED
	},
	{
		title: '截图',
		action: ACTION_SCREENSHOT_ADDED
	}
]

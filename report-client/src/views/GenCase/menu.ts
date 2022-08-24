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

export const formCfg = {
	[ACTION_GET_DOM]: {
		inputOptions: {
			clazzName: [
				{
					label: '元素类名：',
					value: ''
				}
			],
			compName: [
				{
					label: '组件名：',
					value: ''
				}
			]
		}
	},
	[ACTION_WAIT_FOR]: {
		selectOptions: [
			{
				label: 'waitFor 时间',
				value: 'waitForSomeTime'
			},
			{
				label: 'waitFor 页面路由',
				value: 'waitForExactRouter'
			},
			{
				label: 'waitFor 接口',
				value: 'waitForApiResponse'
			}
		],
		selectedValue: 'waitForSomeTime',
		inputOptions: {
			waitForSomeTime: [
				{
					value: 10000,
					label: '时长：'
				}
			],
			waitForExactRouter: [
				{
					value: '',
					label: '页面 path：'
				}
			],
			waitForApiResponse: [
				{
					value: '',
					label: '接口 path：'
				}
			]
		}
	},
	[ACTION_ROUTER_OPERATED]: {
		selectOptions: [
			{
				label: 'navigateBack',
				value: 'operateRouterNavigateBack'
			},
			{
				label: 'reLaunch',
				value: 'operateRouterRelaunch'
			},
			{
				label: 'navigateTo',
				value: 'operateRouterNavigateTo'
			},
			{
				label: 'redirectTo',
				value: 'operateRouterRedirectTo'
			},
			{
				label: 'switchTab',
				value: 'operateRouterSwitchTab'
			}
		],
		selectedValue: 'operateRouterNavigateBack',
		inputOptions: {
			operateRouterNavigateBack: [],
			operateRouterRelaunch: [
				{
					value: '',
					label: 'ReLaunch Url:'
				}
			],
			operateRouterNavigateTo: [
				{
					value: '',
					label: 'NavigateTo Url:'
				}
			],
			operateRouterRedirectTo: [
				{
					value: '',
					label: 'RedirectTo Url:'
				}
			],
			operateRouterSwitchTab: [
				{
					value: '',
					label: 'SwitchTab Url:'
				}
			],
		}
	},
	[ACTION_ASSERTION_ADDED]: {
		selectOptions: [
			{
				label: '断言元素文案内容',
				value: 'assertTextContent'
			},
			{
				label: '断言元素文案长度',
				value: 'assertTextLength'
			},
			{
				label: '断言元素文案符合RegExp',
				value: 'assertTextByRegExp'
			},
			{
				label: '断言元素宽度',
				value: 'assertElementWidth'
			},
			{
				label: '断言元素高度',
				value: 'assertElementHeight'
			},
			{
				label: '断言元素是否存在',
				value: 'assertElementExistence'
			},
			{
				label: '断言接口返回字段',
				value: 'assertResponseFiledValue'
			}
		],
		selectedValue: 'assertTextContent',
		inputOptions: {
			assertTextContent: [
				{
					value: '',
					label: '预期文案：'
				}
			],
			assertTextLength: [
				{
					value: '',
					label: '预期文案长度：',
				}
			],
			assertTextByRegExp: [
				{
					value: '',
					label: '正则元字符：'
				},
				{
					value: '',
					label: '正则修饰符：'
				}
			],
			assertElementWidth: [
				{
					value: '',
					label: '操作符：',
					placeholder: '===, >=, <='
				},
				{
					value: '',
					label: '预期宽度：'
				}
			],
			assertElementHeight: [
				{
					value: '',
					label: '操作符：',
					placeholder: '===, >=, <='
				},
				{
					value: '',
					label: '预期高度：'
				}
			],
			assertElementExistence: [],
			assertResponseFiledValue: [
				{
					value: '',
					label: '取值表达式：'
				},
				{
					value: '',
					label: '比较操作符：'
				},
				{
					value: '',
					label: '返回值预期：'
				}
			]
		}
	},
	[ACTION_SCREENSHOT_ADDED]: {
		inputOptions: {
			fileName: [
				{
					value: '',
					label: '文件名：'
				}
			],
			savePath: [
				{
					value: '',
					label: '保存路径：'
				}
			]
		}
	}
}

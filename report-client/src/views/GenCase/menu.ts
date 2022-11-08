export const addPostFix = (i = '') => `${i}ByEnhanced`
export const ACTION_GET_DOM = addPostFix('getDOM')
export const ACTION_WAIT_FOR = addPostFix('waitFor')
export const ACTION_ASSERTION_ADDED = addPostFix('assertionAdded');
export const ACTION_ROUTER_OPERATED = addPostFix('routerOperated')
export const ACTION_SCREENSHOT_ADDED = addPostFix('screenshotAdded')
export const ACTION_ELEMENT_OPERATION = addPostFix('elementOperate')

export const menus = [
	{
		title: '获取 DOM 元素',
		action: ACTION_GET_DOM
	},
	{
		title: '操作元素',
		action: ACTION_ELEMENT_OPERATION
	},
	{
		title: '新增 WaitFor',
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
		selectOptions: [
			{
				label: '单个元素',
				value: 'getDOMIndependently'
			},
			{
				label: '列表元素',
				value: 'getDOMList'
			}
		],
		selectedValue: 'getDOMIndependently',
		inputOptions: {
			getDOMIndependently: [
				{ value: '', label: '类名：', placeholder: '' },
				{ value: '', label: '组件名：', placeholder: '' }
			],
			getDOMList: [
				{ value: '', label: '类名：', placeholder: '' },
				{ value: '', label: '组件名：', placeholder: '' },
				{ value: '0', label: '目标元素索引：', placeholder: '' }
			]
		}
	},
	[ACTION_ELEMENT_OPERATION]: {
		selectOptions: [
			{
				value: 'tap',
				label: '触发tap事件'
			},
			{
				value: 'longpress',
				label: '触发longpress事件'
			},
			{
				value: 'touchstart',
				label: ' 触发touchstart 事件'
			},
			{
				value: 'touchmove',
				label: '触发 touchmove 事件'
			},
			{
				value: 'touchend',
				label: '触发 touchend 事件'
			},
			{
				label: '触发 input 事件',
				value: 'input'
			},
			{
				value: 'trigger',
				label: 'trigger 元素事件'
			},
		],
		selectedValue: 'tap',
		inputOptions: {
			tap: [{ value: '', label: '参数：', placeholder: 'tap 事件对象' }],
			longpress: [{ value: '', label: '参数：', placeholder: 'longpress 事件对象' }],
			touchstart: [{ value: '', label: '参数：', placeholder: 'touchstart 事件对象' }],
			touchmove: [{ value: '', label: '参数：', placeholder: 'touchmove 事件对象' }],
			touchend: [{ value: '', label: '参数：', placeholder: 'touchend 事件对象' }],
			trigger: [
				{ value: '', label: '事件名：', placeholder: 'element.trigger(type: string, detail?: Object): Promise<void>' },
				{ value: '', label: '事件参数：', placeholder: 'element.trigger(type: string, detail?: Object): Promise<void>' }
			],
			input: [{ value: '', label: '输入值：', placeholder: 'element.input(value: string): Promise<void>' }]
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
					label: '时长：', placeholder: ''
				}
			],
			waitForExactRouter: [
				{
					value: '',
					label: '页面 path：', placeholder: ''
				}
			],
			waitForApiResponse: [
				{
					value: '',
					label: '接口 path：', placeholder: ''
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
					label: 'ReLaunch Url:', placeholder: ''
				}
			],
			operateRouterNavigateTo: [
				{
					value: '',
					label: 'NavigateTo Url:', placeholder: ''
				}
			],
			operateRouterRedirectTo: [
				{
					value: '',
					label: 'RedirectTo Url:', placeholder: ''
				}
			],
			operateRouterSwitchTab: [
				{
					value: '',
					label: 'SwitchTab Url:', placeholder: ''
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
					label: '预期文案：', placeholder: ''
				}
			],
			assertTextLength: [
				{
					value: '',
					label: '预期文案长度：', placeholder: ''
				}
			],
			assertTextByRegExp: [
				{
					value: '',
					label: '正则元字符：', placeholder: ''
				},
				{
					value: '',
					label: '正则修饰符：', placeholder: ''
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
					label: '预期宽度：', placeholder: ''
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
					label: '预期高度：', placeholder: ''
				}
			],
			assertElementExistence: [],
			assertResponseFiledValue: [
				{
					value: '',
					label: '取值表达式：',
					placeholder: '{ options: { data: 返回值 }, url: 请求接口 }, options.data.xxx'
				},
				{
					value: '',
					label: '比较操作符：', placeholder: ''
				},
				{
					value: '',
					label: '返回值预期：', placeholder: ''
				}
			]
		}
	},
	[ACTION_SCREENSHOT_ADDED]: {
		selectedValue: 'screenshotFileSave',
		inputOptions: {
			screenshotFileSave: [
				{
					value: '',
					label: '文件名：', placeholder: ''
				},
				{
					value: '',
					label: '保存路径：', placeholder: ''
				}
			]
		}
	}
}

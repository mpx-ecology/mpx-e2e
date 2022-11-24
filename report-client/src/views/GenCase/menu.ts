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
				{ value: '', label: '类名：', placeholder: '元素类名，不是选择器' },
				{ value: '', label: '组件名：', placeholder: '元素最近的自定义组件的 is 属性，如：<some-comp is="组件名" />' }
			],
			getDOMList: [
				{ value: '', label: '类名：', placeholder: '元素类名，不是选择器！' },
				{ value: '', label: '组件名：', placeholder: '元素最近的自定义组件的 is 属性，如：<some-comp is="组件名" />' },
				{ value: '0', label: '目标元素索引：', placeholder: '目标元素在集合中的索引位置' }
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
					label: '时长：',
					placeholder: '等待时长'
				}
			],
			waitForExactRouter: [
				{
					value: '',
					label: '页面 path：',
					placeholder: '请输入页面的路由：homepage/pages/index'
				}
			],
			waitForApiResponse: [
				{
					value: '',
					label: '接口 path：',
					placeholder: '请输入接口名：/some/api/name'
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
					label: 'ReLaunch Url:',
					placeholder: '请输入 ReLaunch 的页面路径'
				}
			],
			operateRouterNavigateTo: [
				{
					value: '',
					label: 'NavigateTo Url:',
					placeholder: '请输入 NavigateTo 的页面路径'
				}
			],
			operateRouterRedirectTo: [
				{
					value: '',
					label: 'RedirectTo Url:',
					placeholder: '请输入 RedirectTo 的页面路径'
				}
			],
			operateRouterSwitchTab: [
				{
					value: '',
					label: 'SwitchTab Url:',
					placeholder: '请输入 SwitchTab 的页面路径'
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
					label: '预期文案：',
					placeholder: '请输入预期文案'
				}
			],
			assertTextLength: [
				{
					value: '',
					label: '预期文案长度：',
					placeholder: '请输入预期文案长度'
				}
			],
			assertTextByRegExp: [
				{
					value: '',
					label: '正则元字符：',
					placeholder: '请输入正则元字符'
				},
				{
					value: '',
					label: '正则修饰符：',
					placeholder: '请输入正则修饰符'
				}
			],
			assertElementWidth: [
				{
					value: '',
					label: '操作符：',
					placeholder: '请输入比较操作符，如===, >=, <='
				},
				{
					value: '',
					label: '预期宽度：',
					placeholder: '请输入预期宽度'
				}
			],
			assertElementHeight: [
				{
					value: '',
					label: '操作符：',
					placeholder: '请输入比较操作符，如===, >=, <='
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
					placeholder: '数据格式：{ options: { data: 返回值 }, url: 请求接口 }, options.data.xxx'
				},
				{
					value: '',
					label: '比较操作符：',
					placeholder: '请输入比较操作符，如===, >=, <='
				},
				{
					value: '',
					label: '预期返回值：',
					placeholder: '请输入预期返回值'
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
					label: '文件名：',
					placeholder: '请输入截图文件名'
				},
				{
					value: '',
					label: '保存路径：',
					placeholder: '请输入截图保存路径'
				}
			]
		}
	}
}

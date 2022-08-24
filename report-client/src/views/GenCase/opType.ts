const opGenerator = {
	tap: (s) => `触发 tap 事件，标签名：${s.tagName} 文案：${s.text}`,
	touchmove: (s) => `触发 touchmove 事件；标签名：${s.tagName} 文案：${s.text}`,
	assertVisible: (s) => `断言 ${s}元素是否存在`,
	dataSnapshot: (s) => `断言数据快照`,
	wxmlSnapshot: (s) => `断言 wxml 快照`,
	navigateLeft: () => `操作路由返回`,
	scroll: (s) => `元素触发滚动事件 标签名：${s.tagName} 文案：${s.text}`,
	getDOMByEnhanced: ({ data }) => `获取元素 ${ data.compName[0].value }.${data.clazzName[0].value}`,
	waitForSomeTime: ({ data }) => `等待时长${data[0].value}`,
	waitForExactRouter: ({ data }) => `等待指定路由${data[0].value}`,
	waitForApiResponse: ({ data }) => `等待接口${data[0].value}响应`,
	operateRouterNavigateBack: ({ data }) => `操作路由返回 ${data ? data : ''}`,
	operateRouterRelaunch: ({ data }) => `操作路由 Relaunch ${data[0].value}`,
	operateRouterNavigateTo: ({ data }) => `operateRouterNavigateTo ${data[0].value}`,
	operateRouterRedirectTo: ({ data }) => `operateRouterRedirectTo ${data[0].value}`,
	operateRouterSwitchTab: ({ data }) => `操作路由切换 TAB ${data[0].value}`,
	assertTextContent: ({ data }) => `断言文字内容 ${data[0].value}`,
	assertTextLength: ({ data }) => `断言文字长度 ${data[0].value}`,
	assertTextByRegExp: ({ data }) => `断言文字被正则/${ data[0].value }/${data[1].value}匹配`,
	assertElementWidth: ({ data }) => `断言元素宽度${data[0].value} ${data[1].value}`,
	assertElementHeight: ({ data }) => `断言元素长度 ${data[0].value} ${data[1].value}`,
	assertElementExistence: () => `断言元素是否存在`,
	assertResponseFiledValue: ({ data }) => `断言接口返回值 ${data[0].value} ${data[1].value}`,
	screenshotAddedByEnhanced: ({ data }) => `截图${data.fileName[0].value && data.savePath[0].value ? data.savePath[0].value + '/' + data.fileName[0].value : ''}`
}

export type opTypes = 'tap' | 'assertVisible' | 'dataSnapshot' | 'wxmlSnapshot' | 'assertTextContent' | 'assertTextLength' | 'assertTextByRegExp' | 'assertElementWidth' | 'assertElementLength' | 'assertResponseContent' | 'waitForSomeTime' | 'waitForExactRouter' | 'waitForApiResponse' | 'operateRouterRelaunch' | 'operateRouterBack' | 'operateRouterSwitchTab' | 'navigateLeft' | 'scroll'

export default opGenerator

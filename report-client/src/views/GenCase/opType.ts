const opGenerator: Record<any, any> = {
	tap: (s:any) => `触发 tap 事件，标签名：${s.tagName} 文案：${s.text}`,
	touchmove: (s:any) => `触发 touchmove 事件；标签名：${s.tagName} 文案：${s.text}`,
	assertVisible: (s:any) => `断言 ${s}元素是否存在`,
	dataSnapshot: () => `断言数据快照`,
	wxmlSnapshot: () => `断言 wxml 快照`,
	navigateLeft: () => `操作路由返回`,
	scroll: (s:any) => `元素触发滚动事件 标签名：${s.tagName} 文案：${s.text}`,
	getDOMByEnhanced: (s: any) => `获取元素 ${ s.data.compName[0].value }.${s.data.clazzName[0].value}`,
	waitForSomeTime: (s:any) => `等待时长${s.data[0].value}`,
	waitForExactRouter: (s:any) => `等待指定路由${s.data[0].value}`,
	waitForApiResponse: (s:any) => `等待接口${s.data[0].value}响应`,
	operateRouterNavigateBack: () => `操作路由返回`,
	operateRouterRelaunch: (s:any) => `操作路由 Relaunch ${s.data[0].value}`,
	operateRouterNavigateTo: (s:any) => `operateRouterNavigateTo ${s.data[0].value}`,
	operateRouterRedirectTo: (s:any) => `operateRouterRedirectTo ${s.data[0].value}`,
	operateRouterSwitchTab: (s:any) => `操作路由切换 TAB ${s.data[0].value}`,
	assertTextContent: (s:any) => `断言文字内容 ${s.data[0].value}`,
	assertTextLength: (s:any) => `断言文字长度 ${s.data[0].value}`,
	assertTextByRegExp: (s:any) => `断言文字被正则/${ s.data[0].value }/${s.data[1].value}匹配`,
	assertElementWidth: (s:any) => `断言元素宽度${s.data[0].value} ${s.data[1].value}`,
	assertElementHeight: (s:any) => `断言元素长度 ${s.data[0].value} ${s.data[1].value}`,
	assertElementExistence: () => `断言元素是否存在`,
	assertResponseFiledValue: (s:any) => `断言接口返回值 ${s.data[0].value} ${s.data[1].value}`,
	screenshotAddedByEnhanced: (s:any) => `截图${s.data.fileName[0].value && s.data.savePath[0].value ? s.data.savePath[0].value + '/' + s.data.fileName[0].value : ''}`
}

export type opTypes = 'tap' | 'assertVisible' | 'dataSnapshot' | 'wxmlSnapshot' | 'assertTextContent' | 'assertTextLength' | 'assertTextByRegExp' | 'assertElementWidth' | 'assertElementLength' | 'assertResponseContent' | 'waitForSomeTime' | 'waitForExactRouter' | 'waitForApiResponse' | 'operateRouterRelaunch' | 'operateRouterBack' | 'operateRouterSwitchTab' | 'navigateLeft' | 'scroll'

export default opGenerator

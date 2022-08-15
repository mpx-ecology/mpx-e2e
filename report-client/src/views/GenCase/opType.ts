const opGenerator = {
	tap: (s:string) => `触发 tap 事件${s ? s : ''}`,
	touchmove: (s:string) => `触发 touchmove 事件${s ? s : ''}`,
	assertVisible: (s:string) => `断言 ${s}元素是否存在`,
	dataSnapshot: (s = '') => `断言数据快照`,
	wxmlSnapshot: (s = '') => `断言 wxml 快照`,
	assertTextContent: (s = '') => `断言文字内容 ${s}`,
	assertTextLength: (s = '') => `断言文字长度`,
	assertTextByRegExp: (s:string) => `断言文字是否被${s}匹配`,
	assertElementWidth: (s:string) => `断言元素宽度${s}`,
	assertElementLength: (s = '') => `断言元素长度`,
	assertResponseContent: (s:string) => `断言接口${s}返回值`,
	waitForSomeTime: (s:string) => `等待时长${s}`,
	waitForExactRouter: (s:string) => `等待指定路由${s}`,
	waitForApiResponse: (s:string) => `等待接口${s}响应`,
	operateRouterRelaunch: (s = '') => `操作路由 Relaunch`,
	operateRouterBack: (s?:string) => `操作路由返回`,
	operateRouterSwitchTab: (s = '') => `操作路由切换 TAB`,
	navigateLeft: () => `操作路由返回`,
	scroll: (s: string) => `元素触发滚动事件 ${s ? s : ''}`
}

export type opTypes = 'tap' | 'assertVisible' | 'dataSnapshot' | 'wxmlSnapshot' | 'assertTextContent' | 'assertTextLength' | 'assertTextByRegExp' | 'assertElementWidth' | 'assertElementLength' | 'assertResponseContent' | 'waitForSomeTime' | 'waitForExactRouter' | 'waitForApiResponse' | 'operateRouterRelaunch' | 'operateRouterBack' | 'operateRouterSwitchTab' | 'navigateLeft' | 'scroll'

export default opGenerator

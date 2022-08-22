const opGenerator = {
  tap: (s) => `触发 tap 事件${s.tagName ? s.tagName + s.text ? ' >>' + s.text: '' : ''}`,
  touchmove: (s) => `触发 touchmove 事件${s ? s : ''}`,
  assertVisible: (s) => `断言 ${s}元素是否存在`,
  dataSnapshot: (s) => `断言数据快照`,
  wxmlSnapshot: (s) => `断言 wxml 快照`,
  navigateLeft: () => `操作路由返回`,
  scroll: (s) => `元素触发滚动事件 ${s ? s : ''}`,
  getDOMByEnhanced: (s) => `类名+组件名获取元素 ${s.clazzName && s.compName ? s.compName + '.'  + s.clazzName : ''}`,
  waitForSomeTime: (s) => `等待时长${s}`,
  waitForExactRouter: (s) => `等待指定路由${s.waitForExactRouterVal}`,
  waitForApiResponse: (s) => `等待接口${s.waitForApiResponseVal}响应`,
  operateRouterNavigateBack: (s) => `操作路由返回`,
  operateRouterRelaunch: (s) => `操作路由 Relaunch`,
  operateRouterNavigateTo: () => `operateRouterNavigateTo`,
  operateRouterRedirectTo: () => `operateRouterRedirectTo`,
  operateRouterSwitchTab: (s) => `操作路由切换 TAB`,
  assertTextContent: (s) => `断言文字内容 ${s.assertTextContentVal}`,
  assertTextLength: (s) => `断言文字长度 ${s.assertTextLengthVal}`,
  assertTextByRegExp: (s) => `断言文字是否被${s.assertTextByRegExpVal ? s.assertTextByRegExpVal : ''}匹配`,
  assertElementWidth: (s) => `断言元素宽度${s}`,
  assertElementHeight: (s = '') => `断言元素长度`,
  assertElementExistence: (s) => `断言元素是否存在：${s ? s : ''}`,
  assertResponseFiledValue: (s) => `断言接口${s}返回值`,
  screenshotAddedByEnhanced: (s) => `截图：${s.fileName && s.savePath ? s.savePath + '/' + s.fileName : ''}`
}

module.exports = opGenerator

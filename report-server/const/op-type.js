module.exports = {
  tap: (s) => `点击${s ? s : ''}`,
  assertVisible: (s) => `断言 ${s}元素是否存在`,
  dataSnapshot: (s) => `断言数据快照`,
  wxmlSnapshot: (s) => `断言 wxml 快照`,
  assertTextContent: (s) => `断言文字内容`,
  assertTextLength: (s) => `断言文字长度`,
  assertTextByRegExp: (s) => `断言文字是否被${s}匹配`,
  assertElementWidth: (s) => `断言元素宽度${s}`,
  assertElementLength: (s) => `断言元素长度`,
  assertResponseContent: (s) => `断言接口${s}返回值`,
  waitForSomeTime: (s) => `等待时长${s}`,
  waitForExactRouter: s => `等待指定路由{%s}`,
  waitForApiResponse: s => `等待接口${s}响应`,
  operateRouterRelaunch: s => `操作路由 Relaunch`,
  operateRouterBack: s => `操作路由返回`,
  operateRouterSwitchTab: s => `操作路由切换 TAB`
}

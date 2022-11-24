const automator = require('miniprogram-automator');
const MiniProgram = require('./miniprogram');
const screenshotJS = require('./screenshot')

module.exports = class Automator {
  async connect(options) {
    const miniProgram = await automator.connect(options)
    const mini = new MiniProgram(miniProgram)
    await mini.init({ mockCfg: this.mockCfg, injectInterceptorCfg: this.injectInterceptorCfg })
    screenshotJS.mounted(mini)
    return mini
  }
  async launch(options) {
    const miniProgram = await automator.launch(options)
    const mini = new MiniProgram(miniProgram)
    await mini.init({ mockCfg: this.mockCfg, injectInterceptorCfg: this.injectInterceptorCfg })
    screenshotJS.mounted(mini)
    return mini
  }
  initMock(mockCfg) {
    if (mockCfg) {
      const E2eMock = require('./e2e-mock/mock');
      this.mockCfg = mockCfg
      this.mockHelper = new E2eMock(mockCfg)
    }
  }
  injectInterceptors (interceptorCfg) {
    this.injectInterceptorCfg = interceptorCfg
  }
  setMock (path, response) {
    if (this.mockHelper) {
      return this.mockHelper.setMock(path, response)
    } else {
      console.error('the Mock is disabled! set `mockCfg` property when init Automator')
    }
  }
  removeMockFromMap (path) {
    if (this.mockHelper) {
      return this.mockHelper.removeMockFromMap(path)
    } else {
      console.error('the Mock is disabled! set `mockCfg` property when init Automator')
    }
  }
  screenshotHandler (config) {
    return screenshotJS.created(config)
  }
}

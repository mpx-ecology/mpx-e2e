import automator from 'miniprogram-automator'
import MiniProgram from './miniprogram'
import { IConnectOptions, ILaunchOptions } from 'miniprogram-automator/out/Launcher'
import E2eMock, { E2eMockConfig } from './e2e-mock/mock';

export default class Automator {
  mockHelper?: E2eMock
  async connect(options: IConnectOptions) {
    const miniProgram = await automator.connect(options)
    return new MiniProgram(miniProgram)
  }
  async launch(options: ILaunchOptions) {
    const miniProgram = await automator.launch(options)
    return miniProgram ? new MiniProgram(miniProgram) : miniProgram
  }
  initMock(mockCfg: E2eMockConfig) {
    if (mockCfg) {
      this.mockHelper = new E2eMock(mockCfg)
    }
  }
  setMock (path:string, response:Record<any, any>) {
    if (this.mockHelper) {
      return this.mockHelper.setMock(path, response)
    } else {
      console.error('the Mock is disabled! set `mockCfg` property when init Automator')
    }
  }
  removeMockFromMap (path:string) {
    if (this.mockHelper) {
      return this.mockHelper.removeMockFromMap(path)
    } else {
      console.error('the Mock is disabled! set `mockCfg` property when init Automator')
    }
  }
}

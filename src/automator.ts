import automator from 'miniprogram-automator'
import MiniProgram from './miniprogram'
import { IConnectOptions, ILaunchOptions } from 'miniprogram-automator/out/Launcher'
import E2eMock, { E2eMockConfig } from './e2e-mock/mock';
type Mini = import('miniprogram-automator/out/MiniProgram').default
export default class Automator {
  mockHelper?: E2eMock
  async connect(options: IConnectOptions) {
    const miniProgram = await automator.connect(options)
    const mini = new MiniProgram(miniProgram)
    await mini.init()
    return mini
  }
  async launch(options: ILaunchOptions) {
    const miniProgram: any = await automator.launch(options)
    const mini = new MiniProgram(miniProgram)
    await mini.init()
    return mini
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

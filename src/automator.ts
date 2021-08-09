import automator from 'miniprogram-automator'
import MiniProgram from './miniprogram'
import { IConnectOptions, ILaunchOptions } from 'miniprogram-automator/out/Launcher'

export default class Automator {
  async connect(options: IConnectOptions) {
    const miniProgram = await automator.connect(options)
    return new MiniProgram(miniProgram)
  }
  async launch(options: ILaunchOptions) {
    const miniProgram = await automator.launch(options)
    return miniProgram ? new MiniProgram(miniProgram) : miniProgram
  }
}
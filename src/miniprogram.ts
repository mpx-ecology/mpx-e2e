import EPage from './page'
type MiniProgram = import('miniprogram-automator/out/MiniProgram').default
type Element = import('miniprogram-automator/out/Element').default
type Page = import('miniprogram-automator/out/Page').default

interface CurWaitType {
  path: string
  resolve: any
}

export default class EMiniProgram {
  miniProgram: MiniProgram
  curWaitPage!: CurWaitType
  curWaitRequest!: CurWaitType
  curWaitResponse!: CurWaitType
  cachePageStack = new Set()
  constructor (options: MiniProgram) {
    const miniProgram = Object.create(options)
    // 重构返回page的方法，用Epage代替

    const pageStack = miniProgram.pageStack
    miniProgram.pageStack = async () => {
      let pages = await pageStack.call(options)
      pages = pages.length && pages.map((item:Page) => new EPage(item))
      return pages
    }
    const refactorFns = [
      'navigateTo', 'redirectTo', 'navigateBack',
      'reLaunch', 'switchTab', 'currentPage']
    refactorFns.forEach(item => {
      const fn = miniProgram[item]
      miniProgram[item] = async (url?:string) => {
        const page = await fn.call(options, url)
        return new EPage(page)
      }
    })
    // 新增方法
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    miniProgram.wait = (...args: [any]) => this.wait.call(that, ...args)
    miniProgram.currentPagePath = () => this.currentPagePath.call(that)
    this.miniProgram = miniProgram
    // 初始化与appservice交互
    this.init()
    return miniProgram
  }
  /** 返回当前页面路径 */
  async currentPagePath (): Promise<string | undefined> {
    const curPage = await this.miniProgram.currentPage()
    return curPage ? curPage.path : curPage
  }
  /** 可以等待三种类型 页面 发请求 请求返回 */
  async wait (path: string, type = 'page', timeout?: number): Promise<string | undefined> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      console.log(this, 'this')
      if (type === 'page' && path.startsWith('https')) {
        type = 'response'
      }

      switch (type) {
        case 'page':
          // eslint-disable-next-line no-case-declarations
          const curPath = await this.currentPagePath()
          console.log('期望进入的path===', path, '当前===', curPath)
          if (curPath === path) {
            return resolve(path)
          }
          this.curWaitPage = {
            path,
            resolve
          }
          break
        case 'request':
          this.curWaitRequest = {
            path,
            resolve
          }
          break
        case 'response':
          this.curWaitResponse = {
            path,
            resolve
          }
          break
        default:
          break
      }
      if (timeout) {
        setTimeout(reject, timeout)
      }
    })
  }
  /** 打印元素日志 */
  consoleWxml (element: Element): void {
    element && element.wxml().then((data:any) => console.log(data))
  }
  /** 初始化工作 */
  async init(): Promise<void> {
    /** 监听页面渲染，需要ready搭配show生命周期 还有unload来完成页面等待 */
    await this.miniProgram.exposeFunction('onPageReady', (options: any) => {
      const { curWaitPage, cachePageStack } = this
      if (curWaitPage.path === options) {
        curWaitPage.resolve(options)
        curWaitPage.path = ''
        if (!cachePageStack.has(options)) {
          cachePageStack.add(options)
        }
        console.log(options, '渲染完成===')
      }
    })
    await this.miniProgram.exposeFunction('onPageShow', (options: any) => {
      const { curWaitPage, cachePageStack } = this
      if (curWaitPage.path === options && cachePageStack.has(options)) {
        console.log('页面展示===', options)
        curWaitPage.resolve(options)
        curWaitPage.path = ''
      }
    })
    await this.miniProgram.exposeFunction('onPageUnload', (options: any) => {
      const { cachePageStack } = this
      if (cachePageStack.has(options)) {
        cachePageStack.delete(options)
        console.log('卸载页面===', options)
      }
    })
    /** 请求相关的等待实现 */
    await this.miniProgram.exposeFunction('onXfetchRequest', (options: any) => {
      const { curWaitRequest } = this
      const url = options.url && options.url.split('?')[0]
      if (curWaitRequest.path === url) {
        curWaitRequest.resolve({ url, options })
        curWaitRequest.path = ''
        console.log('request===', url)
      }
    })
    await this.miniProgram.exposeFunction('onXfetchResponse', (options: any) => {
      const url = options.requestConfig && options.requestConfig.url && options.requestConfig.url.split('?')[0]
      const { curWaitResponse } = this
      if (curWaitResponse.path === url) {
        curWaitResponse.resolve({ url, options })
        curWaitResponse.path = ''
        console.log('response===', url)
      }
    })
  }
}
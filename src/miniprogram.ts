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
    curWaitPage: CurWaitType | undefined
    curWaitRequest: CurWaitType | undefined
    curWaitResponse: CurWaitType | undefined
    curWaitComponent: CurWaitType | undefined
    curWaitComponentUpdate: CurWaitType | undefined
    hasAbility = false
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
      miniProgram.wait = (...args:[any]) => this.wait.call(that, ...args)
      miniProgram.waitAll = (...args:[any]) => this.waitAll.call(that, ...args)
      miniProgram.currentPagePath = () => this.currentPagePath.call(that)

      miniProgram.init = () => this.init.call(that)

      this.miniProgram = miniProgram
      // 初始化与appservice交互
      return miniProgram
    }
    /** 返回当前页面路径 */
    async currentPagePath (): Promise<string | undefined> {
      const curPage = await this.miniProgram.currentPage()
      return curPage ? curPage.path : curPage
    }
    /** 可以等待五种种类型 页面 发请求 请求返回 组件渲染 组件更新 */
    wait (path: string, type = 'page', timeout = 8000): Promise<string | undefined> | void {
      if (!this.hasAbility) return console.log('由于在app上未注册mixin,xfetch导致初始化未完成，wait能力无法支持')
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        console.log('当前wait===', path, ' type=== ', type)
        if (type === 'page' && path.startsWith('https')) {
          type = 'response'
        }
        let doudiTimer: any
        let resolvep = (data:any) => {
          clearTimeout(doudiTimer)
          return resolve(data)
        }
        switch (type) {
          case 'page': {
            const curPath = await this.currentPagePath()
            console.log('期望进入的path===', path, '当前===', curPath)
            // wait的是当前页面直接返回
            if (curPath === path) {
              return resolve(path)
            }
            // 兜底
            doudiTimer = setTimeout(async () => {
              const curPath = await this.currentPagePath()
              console.log(path + '触发兜底，鉴于两种可能情况，1: 生命周期执行在wait前。2: onShow未执行' + curPath)
              if (curPath === path) {
                console.log(curPath, '兜底成功', path)
                return resolve(path)
              }
            }, timeout)
            this.curWaitPage = {
              path,
              resolve: resolvep
            }
            break
          }
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
          case 'component':
            this.curWaitComponent = {
              path,
              resolve
            }
            break
          case 'componentUpdate': {
            let timer: any
            this.curWaitComponentUpdate = {
              path,
              resolve: (data:any) => {
                clearTimeout(timer)
                timer = setTimeout(() => resolve(data), timeout)
              }
            }
          }
            break
          default:
            break
        }
      })
    }
    waitAll<T> (...args:[Promise<T>]): Promise<any> {
      return Promise.all([...args])
    }
    /** 打印元素日志 */
    consoleWxml (element: Element): void {
      element && element.wxml().then((data:any) => console.log(data))
    }
    /** 初始化工作 */
    async init(): Promise<void> {
      console.log('init start')
      /** 监听页面渲染，需要ready搭配show生命周期 还有unload来完成页面等待 */
      await this.miniProgram.exposeFunction('onPageReady', (options: any) => {
        const { curWaitPage, cachePageStack } = this
        if (curWaitPage && curWaitPage.path === options) {
          curWaitPage.path = ''
          curWaitPage.resolve(options)
          console.log('wait成功！渲染完成===', options)
        }
        if (!cachePageStack.has(options)) {
          cachePageStack.add(options)
        }
      })
      await this.miniProgram.exposeFunction('onPageShow', (options: any) => {
        const { curWaitPage, cachePageStack } = this
        if (curWaitPage && curWaitPage.path === options && cachePageStack.has(options)) {
          console.log('wait成功！页面展示===', options)
          curWaitPage.path = ''
          curWaitPage.resolve(options)
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
        if (curWaitRequest && curWaitRequest.path === url) {
          curWaitRequest.path = ''
          curWaitRequest.resolve({ url, options })
          console.log('wait成功！request===', url)
        }
      })
      await this.miniProgram.exposeFunction('onXfetchResponse', (options: any) => {
        const url = options.requestConfig && options.requestConfig.url && options.requestConfig.url.split('?')[0]
        const { curWaitResponse } = this
        if (curWaitResponse && curWaitResponse.path === url) {
          curWaitResponse.path = ''
          curWaitResponse.resolve({ url, options })
          console.log('wait成功！response===', url)
        }
      })
      await this.miniProgram.exposeFunction('onComponentUpdate', (options: any) => {
        const { curWaitComponentUpdate } = this
        if (curWaitComponentUpdate && curWaitComponentUpdate.path === options.path) {
          curWaitComponentUpdate.path = ''
          curWaitComponentUpdate.resolve(options.data)
          console.log('waitComponentUpdate成功！Component===', options.path)
        }
      })

      await this.miniProgram.exposeFunction('onComponentReady', (options: any) => {
        const { curWaitComponent } = this
        if (curWaitComponent && curWaitComponent.path === options) {
          curWaitComponent.path = ''
          curWaitComponent.resolve(options)
          console.log('wait成功！Component===', options.path)
        }
      })
      await this.miniProgram.exposeFunction('onHasAbility', (options: boolean) => {
        this.hasAbility = options
      })

      await this.miniProgram.evaluate(() => {
        const { xfetch, mixin } = getApp()
        function abilityCheck() {
          return typeof mixin === 'function' && xfetch
        }
        const hasAbility = !!abilityCheck()
        onHasAbility(hasAbility)
        if (!hasAbility) return

        mixin({
          onShow() {
            // console.log('onShow ' + this.route)
            onPageShow(this.route)
          },
          onUnload() {
            onPageUnload(this.route)
          },
          onReady() {
            onPageReady(this.route)
          }
        }, 'page')
        mixin({
          updated() {
            // console.log('onUpdate ' + this.is, this.data)
            onComponentUpdate({ data: this.data, path: this.is })
          },
          ready() {
            onComponentReady(this.is)
          }
        }, 'component')
        xfetch.interceptors.request.use(function (config:any) {
          onXfetchRequest(config)
          return config
        })
        xfetch.interceptors.response.use(function (config:any) {
          onXfetchResponse(config)
          return config
        })
      })
      console.log('init done')
    }
}

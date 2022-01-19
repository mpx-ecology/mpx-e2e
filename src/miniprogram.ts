import EPage from './page'
import chalk from 'chalk'
import MiniProgram from "miniprogram-automator/out/MiniProgram"
import Element from "miniprogram-automator/out/Element"
import Page from "miniprogram-automator/out/Page"

const log = (...str: string[]) => console.log(chalk.blue.bgGreenBright.bold('【e2e-sdk】: '), ...str)

interface CurWaitType {
  path: string
  resolve: any
}
type InterceptFn = (config: any) => void

export default class EMiniProgram {
    private miniProgram: MiniProgram
    private curWaitPage: CurWaitType | undefined
    private curWaitRequest: CurWaitType | undefined
    private curWaitResponse: CurWaitType | undefined
    private curWaitComponent: CurWaitType | undefined
    private curWaitComponentUpdate: CurWaitType | undefined
    private hasAbility = false
    private cachePageStack = new Set()
    private interceptRequetStack:InterceptFn[] = []
    private interceptResponseStack:InterceptFn[] = []
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
      miniProgram.addInterceptRequest = (fn: InterceptFn) => this.interceptRequetStack.push(fn)
      miniProgram.addInterceptResponse = (fn: InterceptFn) => this.interceptResponseStack.push(fn)
      miniProgram.init = (iniCfg: Record<any, any>) => this.init.call(that, iniCfg)

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
    wait (path: string, type = 'page'): Promise<string | undefined> | void {
      if (!this.hasAbility) return log(chalk.red.bold('由于在app上未注册mixin,xfetch导致初始化未完成，wait能力无法支持'))
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        if (type === 'page' && /^(http|\/)/g.test(path)) {
          type = 'response'
        }
        switch (type) {
          case 'page': {
            const curPath = await this.currentPagePath()
            // wait的是当前页面直接返回
            if (curPath === path) {
              log(chalk.green('wait成功!=>' + path + '(page)'))
              return resolve(path)
            }
            // 兜底 防止onShow没有触发
            let doudiTimer = setTimeout(async () => {
              const curPath = await this.currentPagePath()
              if (curPath === path) {
                log(chalk.green('兜底成功!=>' + path + '(page)'))
                return resolve(path)
              }
            }, 3000)
            let resolvep = (data:any) => {
              clearTimeout(doudiTimer)
              return resolve(data)
            }
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
            this.curWaitComponentUpdate = {
              path,
              resolve
            }
          }
            break
          default:
            break
        }
        log(chalk.yellow('当前wait=> type ' + type + ' ' + path))
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
    async init(initCfg?: Record<any, any>): Promise<void> {
      console.log('initCfg ------>>>>>',initCfg)
      log(chalk.blue.bold('初始化开始'))
      /** 监听页面渲染，需要ready搭配show生命周期 还有unload来完成页面等待 */
      await this.miniProgram.exposeFunction('onPageReady', (options: any) => {
        const { curWaitPage, cachePageStack } = this
        if (curWaitPage && curWaitPage.path === options) {
          curWaitPage.path = ''
          curWaitPage.resolve(options)
          log(chalk.green('wait成功!=>' + options + '(page)'))
        }
        if (!cachePageStack.has(options)) {
          cachePageStack.add(options)
        }
      })
      await this.miniProgram.exposeFunction('onPageShow', (options: any) => {
        const { curWaitPage, cachePageStack } = this
        if (curWaitPage && curWaitPage.path === options && cachePageStack.has(options)) {
          log(chalk.green('wait成功!=>' + options + '(page)'))
          curWaitPage.path = ''
          curWaitPage.resolve(options)
        }
      })
      await this.miniProgram.exposeFunction('onPageUnload', (options: any) => {
        const { cachePageStack } = this
        if (cachePageStack.has(options)) {
          cachePageStack.delete(options)
          log(chalk.gray('页面卸载=>' + options))
        }
      })
      /** 请求相关的等待实现 */
      await this.miniProgram.exposeFunction('onXfetchRequest', (options: any) => {
        const { curWaitRequest, interceptRequetStack } = this
        const url = options.url && options.url.split('?')[0]
        if (curWaitRequest && curWaitRequest.path === url) {
          curWaitRequest.path = ''
          curWaitRequest.resolve({ url, options })
          log(chalk.green('wait成功!=>' + url + '(request)'))
        }
        interceptRequetStack.forEach(item => {
          if (typeof item === 'function') { item(options) }
        })
      })
      await this.miniProgram.exposeFunction('onXfetchResponse', (options: any) => {
        const url = options.requestConfig && options.requestConfig.url && options.requestConfig.url.split('?')[0]
        const { curWaitResponse, interceptResponseStack } = this
        // console.log('onXfetchResponse', curWaitResponse?.path, url?.includes(curWaitResponse?.path))
        if (curWaitResponse && url?.includes(curWaitResponse?.path)) {
          curWaitResponse.path = ''
          curWaitResponse.resolve({ url, options })
          log(chalk.green('wait成功!=>' + url + '(response)'))
        }
        interceptResponseStack.forEach(item => {
          if (typeof item === 'function') { item(options) }
        })
      })
      await this.miniProgram.exposeFunction('onComponentUpdate', (options: any) => {
        const { curWaitComponentUpdate } = this
        if (curWaitComponentUpdate && curWaitComponentUpdate.path === options.path) {
          curWaitComponentUpdate.path = ''
          curWaitComponentUpdate.resolve(options.data)
          log(chalk.green('wait成功!=>' + options.path + '(componentUpdate)'))
        }
      })

      await this.miniProgram.exposeFunction('onComponentReady', (options: any) => {
        const { curWaitComponent } = this
        if (curWaitComponent && curWaitComponent.path === options) {
          curWaitComponent.path = ''
          curWaitComponent.resolve(options)
          log(chalk.green('wait成功!=>' + options + '(component)'))
        }
      })
      await this.miniProgram.exposeFunction('onHasAbility', (options: boolean) => {
        this.hasAbility = options
      })

      let { mockCfg } = initCfg || {}
      let setProxy = mockCfg?.setProxy
      setProxy = setProxy ? JSON.stringify(setProxy) : false

      // console.log(`mockEnable ====>>>>>`, setProxy);
      let functionStr = `const { xfetch, mixin } = getApp().getMpx() || getApp()
       console.error('hahahhahahahahah')
        // const proxyCfg = getApp().setProxy;
        function abilityCheck() {
          return typeof mixin === 'function' && xfetch
        }
        const hasAbility = !!abilityCheck();
        onHasAbility(hasAbility);
        if (!hasAbility) return;

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
        }, 'page');
        mixin({
          updated() {
            // console.log('onUpdate ' + this.is, this.data)
            onComponentUpdate({ data: this.data, path: this.is })
          },
          ready() {
            onComponentReady(this.is)
          }
        }, 'component');

        // console.log('proxyCfg ====>>>>>111', mockEnable.setProxy);
        // console.log('mockEnable ===>', ${setProxy});

        if (${setProxy}) {
          let proxyCfg = ${setProxy};
          let cfg = proxyCfg.map(({ test, proxy }) => {
            let host;
            if (test.url) {
              let execR = (/https:\\/\\/([^/]+)/g).exec(test.url);
              host = execR && execR[1] || '';
            } else {
              host = test.host;
            }
            if (!host) {
              console.error(\`【e2e-setMoc-Error】the 'url' or 'host' is required when setProxy!!!!\`)
            }
            return {
              test,
              proxy: Object.assign(proxy, {
                header: {
                  mpx_origin_host: host
                }
              })
            }
          });
          // console.log('cfg ===>>>>', cfg)
          xfetch.setProxy(cfg);
        }

        xfetch.interceptors.request.use(function (config) {
          onXfetchRequest(config);
          return config
        })
        xfetch.interceptors.response.use(function (config) {
          onXfetchResponse(config)
          return config
        })`

      await this.miniProgram.evaluate(new Function('a', 'b', functionStr))
      log(chalk.blue.bold('初始化结束'))
    }
}

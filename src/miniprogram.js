const EPage = require('./page');
const chalk = require('chalk');
const { pushImg, pushJSError } = require('./utils');
const path = require('path');
const screenshotJS = require('./screenshot')


const log = (...str) => console.log(chalk.blue.bgGreenBright.bold('【e2e-sdk】: '), ...str);

module.exports = class EMiniProgram {

    constructor (options) {
      const miniProgram = Object.create(options)
      // 重构返回page的方法，用Epage代替

      const pageStack = miniProgram.pageStack
      miniProgram.pageStack = async () => {
        let pages = await pageStack.call(options)
        pages = pages.length && pages.map((item) => new EPage(item))
        return pages
      };
      const refactorFns = [
        'navigateTo',
        'redirectTo',
        'navigateBack',
        'reLaunch',
        'switchTab',
        'currentPage'
      ];
      refactorFns.forEach(item => {
        const fn = miniProgram[item]
        miniProgram[item] = async (url) => {
          const page = await fn.call(options, url)
          return new EPage(page)
        }
      })
      // 新增方法
      const that = this
      miniProgram.wait = (...args) => this.wait.call(that, ...args)
      miniProgram.waitAll = (...args) => this.waitAll.call(that, ...args)
      miniProgram.currentPagePath = () => this.currentPagePath.call(that)
      miniProgram.addInterceptRequest = (fn) => this.interceptRequetStack.push(fn)
      miniProgram.addInterceptResponse = (fn) => this.interceptResponseStack.push(fn)
      miniProgram.init = (iniCfg) => this.init.call(that, iniCfg)

      // 监听报错信息
      miniProgram.on('exception', async (err) => {
        const rs = await screenshotJS.save({type: 'error'})
        pushJSError({
          message: err.message,
          stack: err.stack,
          page: rs.page,
          imgSrc: rs.src
        })
      })

      const screenshot = miniProgram.screenshot
      miniProgram.screenshot = async (options) => {
        await screenshot.call(miniProgram, options)
        const src = path.resolve(process.cwd(), options.path)
        let page = ''
        try {
          page = await this.currentPagePath()
        } catch (error) {
          // e
        }
        const result = {
          path: options.path,
          src: options.src || src,
          time: Date.now(),
          page,
          type: 'user',
          ...options.params
        }
        pushImg(result)
        return result
      }

      const close = miniProgram.close
      miniProgram.close = async () => {
        await close.call(miniProgram)
        screenshotJS.destroyed()
      }

      this.miniProgram = miniProgram
      // 初始化与appservice交互
      return miniProgram
    }
    /** 返回当前页面路径 */
    async currentPagePath () {
      const curPage = await this.miniProgram.currentPage()
      return curPage ? curPage.path : curPage
    }
    /** 可以等待五种种类型 页面 发请求 请求返回 组件渲染 组件更新 */
    wait (path, type = 'page') {
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
            let resolvep = (data) => {
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
    waitAll (...args) {
      return Promise.all([...args])
    }
    /** 打印元素日志 */
    consoleWxml (element) {
      element && element.wxml().then((data) => console.log(data))
    }
    /** 初始化工作 */
    async init(initCfg) {
      log(chalk.blue.bold('初始化开始'))
      /** 监听页面渲染，需要ready搭配show生命周期 还有unload来完成页面等待 */
      await this.miniProgram.exposeFunction('onPageReady', (options) => {
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
      await this.miniProgram.exposeFunction('onPageShow', (options) => {
        const { curWaitPage, cachePageStack } = this
        if (curWaitPage && curWaitPage.path === options && cachePageStack.has(options)) {
          log(chalk.green('wait成功!=>' + options + '(page)'))
          curWaitPage.path = ''
          curWaitPage.resolve(options)
        }
      })
      await this.miniProgram.exposeFunction('onPageUnload', (options) => {
        const { cachePageStack } = this
        if (cachePageStack.has(options)) {
          cachePageStack.delete(options)
          log(chalk.gray('页面卸载=>' + options))
        }
      })
      /** 请求相关的等待实现 */
      await this.miniProgram.exposeFunction('onXfetchRequest', (options) => {
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
      await this.miniProgram.exposeFunction('onXfetchResponse', (options) => {
        const url = options.requestConfig && options.requestConfig.url && options.requestConfig.url.split('?')[0]
        const { curWaitResponse, interceptResponseStack } = this
        // console.log('onXfetchResponse', curWaitResponse?.path, url?.includes(curWaitResponse?.path))
        if (curWaitResponse && curWaitResponse?.path && url?.includes(curWaitResponse.path)) {
          curWaitResponse.path = ''
          curWaitResponse.resolve({ url, options })
          log(chalk.green('wait成功!=>' + url + '(response)'))
        }
        interceptResponseStack.forEach(item => {
          if (typeof item === 'function') { item(options) }
        })
      })
      await this.miniProgram.exposeFunction('onComponentUpdate', (options) => {
        const { curWaitComponentUpdate } = this
        if (curWaitComponentUpdate && curWaitComponentUpdate.path === options.path) {
          curWaitComponentUpdate.path = ''
          curWaitComponentUpdate.resolve(options.data)
          log(chalk.green('wait成功!=>' + options.path + '(componentUpdate)'))
        }
      })

      await this.miniProgram.exposeFunction('onComponentReady', (options) => {
        const { curWaitComponent } = this
        if (curWaitComponent && curWaitComponent.path === options) {
          curWaitComponent.path = ''
          curWaitComponent.resolve(options)
          log(chalk.green('wait成功!=>' + options + '(component)'))
        }
      })
      await this.miniProgram.exposeFunction('onHasAbility', (options) => {
        this.hasAbility = options
      })

      let { mockCfg } = initCfg || {}
      let setProxy = mockCfg?.setProxy
      setProxy = setProxy ? JSON.stringify(setProxy) : false

      let interceptorCfg = initCfg?.injectInterceptorCfg || {}
      let requestInterceptors = interceptorCfg.request?.map((itm) => {
         return `;(${!itm.preIntercept} || ${itm.preIntercept.toString()}()) 
                     && xfetch.interceptors.request.use(${itm.intercept}
                  )`
      }) || ''

      let responseInterceptors = interceptorCfg.response?.map((item) => {
        return `;(${!item.preIntercept} || ${item.preIntercept.toString()}()) 
                  && xfetch.interceptors.response.use(${item.intercept}
                )`
      }) || ''


      // console.log(`mockInterceptor ====>>>>>`, responseInterceptors);
      let functionStr = `const { xfetch, mixin } = getApp().getMpx() || getApp()
      
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
        });
        xfetch.interceptors.response.use(function (config) {
          onXfetchResponse(config)
          return config
        });
        ${requestInterceptors ? requestInterceptors.join(';') : ''}
        ${responseInterceptors ? responseInterceptors.join(';') : ''}
        `;

      await this.miniProgram.evaluate(new Function(functionStr))
      log(chalk.blue.bold('初始化结束'))
    }
}

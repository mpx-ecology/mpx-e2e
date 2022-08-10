const path = require('path')
const { pushSystemInfo } = require('./utils')

class ScreenShot {
  constructor () {
    this.status = 'pendding'
    this.timer = null
    this.timeout = null
    this.miniProgram = null
    this.config = {
      cacheDirectory: path.resolve(__dirname, '../report-server/cache'), // 缓存目录
      clear: true, // 清除缓存
      timeout: 3000, // 定时截图
      tapSave: true, // 点击事件自动截图
      routeUpdateSave: true, // 路由更新自动截图
      watchRequest: [] // 接口请求自动截图
    }
    this.disable = true
    this.count = 0
    this.prevValue = []
    this.systemInfo = {
      windowWidth: 0,
      windowHeight: 0
    }
  }
  
  init () {
    if (this.miniProgram) {
      this.getSystemInfo()
      this.timer = setInterval(() => {
        this.save({ type: 'timeout' })
      }, this.config.timeout)
      if (this.config.routeUpdateSave) {
        this.routeUpdate()
      }
      if (this.config.watchRequest) {
        this.watchRequest()
      }
    }
  }
  async getSystemInfo () {
    const systemInfo = await this.miniProgram.evaluate(() => {
      // eslint-disable-next-line no-undef
      return wx.getSystemInfoSync()
    })
    pushSystemInfo(systemInfo)
    this.systemInfo.windowWidth = systemInfo.windowWidth
    this.systemInfo.windowHeight = systemInfo.windowHeight
  }
  async tap (params) {
    // 是否启动点击事件自动截图，默认是不开启的，开启之后所有点击事件都会自动截图
    if (this.miniProgram && this.config.tapSave) {
      await this.save(params)
      this.timeout && clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.save({ type: 'timeout' })
      }, 300)
    }
  }
  async save (params) {
    try {
      const name = `${Date.now()}.png`
      const src = path.resolve(this.config.cacheDirectory, name)
      return await this.miniProgram.screenshot({
        path: path.relative(process.cwd(), src),
        src,
        params: Object.assign({}, params)
      })
    } catch (error) {
      // console.log(error)
    }
  }
  async routeUpdate () {
    // 是否启动路由更新自动截图，默认是不开启的，开启之后所有路由切换都会自动截图
    await this.miniProgram.exposeFunction('beforeRouteUpdate', () => {
      // Do something... 
      setTimeout(() => {
        this.save({ type: 'route' })
      }, 300)
    })
    await this.miniProgram.evaluate(() => {
      // eslint-disable-next-line no-undef
      wx.onAppRoute(beforeRouteUpdate)
    })
  }
  async watchRequest () {
    await this.miniProgram.exposeFunction('beforeRequestUpdate', (options) => {
      // Do something... 
      this.config.watchRequest.forEach((item, index) => {
        if (options.requestConfig.url.includes(item.url)) {
          if (item.handler) {
            const res = item.handler(options.data, this.prevValue[index])
            this.prevValue[index] = options.data
            if (res) {
              this.save({ type: 'request' })
            }
          } else {
            this.save({ type: 'request' })
          }
        }
      })
    })
    await this.miniProgram.evaluate(() => {
      // eslint-disable-next-line no-undef
      const { xfetch } = getApp().getMpx()
      if (!xfetch) return
      xfetch.interceptors.response.use(function(res) {
        // eslint-disable-next-line no-undef
        beforeRequestUpdate(res)
        return res
      })
    })
  }
  created (config = {}) {
    let { cacheDirectory } = config || {}
    if (cacheDirectory) {
      cacheDirectory = path.resolve(process.cwd(), config.cacheDirectory)
    } else {
      cacheDirectory = this.config.cacheDirectory
    }
    config.cacheDirectory = cacheDirectory
    this.config = Object.assign(this.config, config)
    this.disable = false
  }
  mounted (miniProgram) {
    if (!this.disable) {
      this.miniProgram = miniProgram
      if (this.status === 'resolved') {
        this.destroyed()
      }
      this.status = 'resolved'
      this.init()
    }
  }
  destroyed () {
    this.status = 'pendding'
    this.timer && clearInterval(this.timer)
    this.timeout && clearTimeout(this.timeout)
  }
}

module.exports = new ScreenShot()

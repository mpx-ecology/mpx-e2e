const path = require('path')
const fs = require('fs')

class ScreenShot {
  constructor () {
    this.status = 'pendding'
    this.timer = null
    this.timeout = null
    this.miniProgram = null
    this.config = {
      cacheDirectory: path.join(__dirname, './cache'), // 缓存目录
      clear: true, // 清除缓存
      timeout: 3000, // 定时截图
      tapSave: false // 点击事件自动截图
    }
    this.disable = true
    this.count = 0
  }
  
  init () {
    if (this.miniProgram) {
      this.timer = setInterval(() => {
        this.save()
      }, this.config.timeout)
    }
  }
  async tap () {
    // 是否启动点击事件自动截图，默认是不开启的，开启之后所有点击事件都会自动截图
    if (this.miniProgram && this.config.tapSave) {
      await this.save()
      // this.timeout && clearTimeout(this.timeout)
      // this.timeout = setTimeout(() => {
      //   this.save()
      // }, 300)
    }
  }
  async save () {
    try {
      const name = `${Date.now()}.png`
      const src = path.join(this.config.cacheDirectory, name)
      await this.miniProgram.screenshot({
        path: src,
        src
      })
    } catch (error) {
      // console.log(error)
    }
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
    let isDirectory = false
    try {
      const stat = fs.statSync(cacheDirectory);
      isDirectory = stat.isDirectory()
    } catch (error) {
      // e
    }
    if (!isDirectory) {
      fs.mkdir(cacheDirectory, () => {})
    } else {
      if (this.config.clear) {
        this.clearFile()
      }
    }
  }
  clearFile ()  {
    const files = fs.readdirSync(this.config.cacheDirectory)
    files.forEach(item => {
      fs.unlinkSync(path.resolve(this.config.cacheDirectory, item))
    })
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

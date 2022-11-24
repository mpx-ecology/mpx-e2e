const Router = require('koa-router');
const fs = require('fs');
const path = require('path');

const router = new Router({
  prefix: '/common'
})

let systemInfo = {
  SDKVersion: "2.25.1",
  batteryLevel: 100,
  benchmarkLevel: 1,
  bluetoothEnabled: true,
  brand: "devtools",
  cameraAuthorized: true,
  deviceOrientation: "portrait",
  devicePixelRatio: 2,
  enableDebug: false,
  fontSizeSetting: 16,
  language: "zh_CN",
  locationAuthorized: true,
  locationEnabled: true,
  microphoneAuthorized: true,
  mode: "default",
  model: "iPhone 6/7/8",
  notificationAuthorized: true,
  pixelRatio: 2,
  platform: "devtools",
  safeArea: {
    bottom: 667,
    height: 647,
    left: 0,
    right: 375,
    top: 20,
    width: 375
  },
  screenHeight: 667,
  screenWidth: 375,
  statusBarHeight: 20,
  system: "iOS 10.0.1",
  version: "8.0.5",
  wifiEnabled: true,
  windowHeight: 667,
  windowWidth: 375
}

router.post('/imgList', (ctx) => {
  try {
    const dist = path.resolve(__dirname, '../testResult.json')
    const oldFile = fs.readFileSync(dist, 'utf8')
    const data = JSON.parse(oldFile)
    const imgList = data.imgList
    if (Array.isArray(imgList)) {
      imgList.push(ctx.request.body)
    } else {
      data.imgList = [ctx.request.body]
    }
    fs.writeFileSync(dist, JSON.stringify(data))
    ctx.body = { error: 0, data: {} }
  } catch (error) {
    ctx.body = { error: 500, data: {} }
  }
})

router.get('/systemInfo', (ctx) => {
  try {
    ctx.body = { error: 0, data: systemInfo }
  } catch (error) {
    ctx.body = { error: 500, data: {} }
  }
})

router.post('/systemInfo', (ctx) => {
  try {
    systemInfo = ctx.request.body
    ctx.body = { error: 0, data: {} }
  } catch (error) {
    ctx.body = { error: 500, data: {} }
  }
})

// 保存js报错信息到本地
router.post('/errorList', (ctx) => {
  try {
    const dist = path.resolve(__dirname, '../testResult.json')
    const oldFile = fs.readFileSync(dist, 'utf8')
    const data = JSON.parse(oldFile)
    const errorList = data.errorList
    if (Array.isArray(errorList)) {
      errorList.push(ctx.request.body)
    } else {
      data.errorList = [ctx.request.body]
    }
    fs.writeFileSync(dist, JSON.stringify(data))
    ctx.body = { error: 0, data: {} }
  } catch (error) {
    ctx.body = { error: 500, data: {} }
  }
})

router.post('/expectList', (ctx) => {
  try {
    const dist = path.resolve(__dirname, '../testResult.json')
    const oldFile = fs.readFileSync(dist, 'utf8')
    const data = JSON.parse(oldFile)
    const expectCount = data.expectCount || 0
    data.expectCount = expectCount + 1
    fs.writeFileSync(dist, JSON.stringify(data))
    ctx.body = { error: 0, data: {} }
  } catch (error) {
    ctx.body = { error: 500, data: {} }
  }
})

router.get('/testResult', (ctx) => {
  try {
    const url = path.resolve(__dirname, '../testResult.json')
    const file = fs.readFileSync(url, { encoding: 'utf-8' })
    ctx.body = { error: 0, data: JSON.parse(file) }
  } catch (error) {
    ctx.body = { error: 500, data: { reportList: [] } }
  }
})

// eslint-disable-next-line no-undef
module.exports = router;

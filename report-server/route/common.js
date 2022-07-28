const Router = require('koa-router');
const fs = require('fs');
const path = require('path');

const router = new Router({
  prefix: '/common'
})

router.post('/imgList', (ctx) => {
  try {
    const dist = path.resolve(__dirname, './testResult.json')
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

router.get('/imgList', (ctx) => {
  try {
    const url = path.resolve(__dirname, './testResult.json')
    const file = fs.readFileSync(url, { encoding: 'utf-8' })
    ctx.body = { error: 0, data: JSON.parse(file) }
  } catch (error) {
    ctx.body = { error: 500, data: { reportList: [] } }
  }
})

router.post('/expectList', (ctx) => {
  try {
    const dist = path.resolve(__dirname, './testResult.json')
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
    const url = path.resolve(__dirname, './testResult.json')
    const file = fs.readFileSync(url, { encoding: 'utf-8' })
    ctx.body = { error: 0, data: JSON.parse(file) }
  } catch (error) {
    ctx.body = { error: 500, data: { reportList: [] } }
  }
})

// eslint-disable-next-line no-undef
module.exports = router;

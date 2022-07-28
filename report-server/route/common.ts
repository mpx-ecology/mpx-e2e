import Router from 'koa-router';
import * as Application from 'koa';
import * as fs from 'fs';
import * as path from 'path';


const router = new Router({
  prefix: '/common'
})

router.post('/imgList', (ctx: Application.DefaultContext) => {
  // console.log(ctx.request.body, 'body ==>')
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
    // 如果服务器不存在请求的图片，返回默认数据
    ctx.body = { error: 500, data: {} }
  }
})

router.post('/expectList', (ctx: Application.DefaultContext) => {
  // console.log(ctx.request.body, 'body ==>')
  try {
    const dist = path.resolve(__dirname, './testResult.json')
    const oldFile = fs.readFileSync(dist, 'utf8')
    const data = JSON.parse(oldFile)
    const expectCount = data.expectCount || 0
    data.expectCount = expectCount + 1
    fs.writeFileSync(dist, JSON.stringify(data))
    ctx.body = { error: 0, data: {} }
  } catch (error) {
    // 如果服务器不存在请求的图片，返回默认数据
    ctx.body = { error: 500, data: {} }
  }
})

router.get('/imgList', (ctx: Application.Context) => {
  try {
    const url = path.resolve(__dirname, './testResult.json')
    const file = fs.readFileSync(url, { encoding: 'utf-8' })
    ctx.body = { error: 0, data: JSON.parse(file) }
  } catch (error) {
    // 如果服务器不存在请求的图片，返回默认数据
    ctx.body = { error: 500, data: { reportList: [], imgList: [] } }
  }
})

router.get('/testResult', (ctx: Application.Context) => {
  try {
    const url = path.resolve(__dirname, './testResult.json')
    const file = fs.readFileSync(url, { encoding: 'utf-8' })
    ctx.body = { error: 0, data: JSON.parse(file) }
  } catch (error) {
    // 如果服务器不存在请求的图片，返回默认数据
    ctx.body = { error: 500, data: { reportList: [], imgList: [] } }
  }
})

export default router
import Router from 'koa-router';
import * as Application from 'koa';
import { imgList } from '../util';
import * as fs from 'fs';
import * as path from 'path';

const router = new Router({
  prefix: '/common'
})

router.get('/imgList', (ctx: Application.Context) => {
  ctx.body = { error: 0, data: imgList }
})

router.get('/testResult', (ctx: Application.Context) => {
  try {
    const url = path.resolve(__dirname, './testResult.json')
    const file = fs.readFileSync(url, { encoding: 'utf-8' })
    ctx.body = { error: 0, data: JSON.parse(file) }
  } catch (error) {
    // 如果服务器不存在请求的图片，返回默认数据
    ctx.body = { error: 500, data: {} }
  }
})

export default router
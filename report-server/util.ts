import * as Application from 'koa';
import * as fs from 'fs';

// interface Img {
//   path: string,
//   src: string
// }

// export const imgList: Img[] = []

// export function pushImg (params: Img): void {
//   imgList.push(params)
// }

export async function handleCors (ctx: Application.Context, next: Application.Next): Promise<any> {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With');
  ctx.set('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
  ctx.set('X-Powered-By', '3.2.1')
  if(ctx.method === 'OPTIONS') {
    ctx.body = '200'
  } else {
    return await next();
  }
}

export async function handleImg (ctx: Application.Context, next: Application.Next): Promise<any> {
  if (ctx.url.includes('png')) {
    try {
      const file = fs.readFileSync(ctx.url)
      ctx.set('content-type', 'image/png')
      ctx.body = file
    } catch (error) {
      // 如果服务器不存在请求的图片，返回默认图片
    }
  } else {
    return await next()
  }
}

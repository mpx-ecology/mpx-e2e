const fs = require('fs');
// interface Img {
//   path: string,
//   src: string
// }

// export const imgList: Img[] = []

// export function pushImg (params: Img): void {
//   imgList.push(params)
// }

exports.handleCors = async function handleCors (ctx, next) {
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

exports.handleImg = async function handleImg (ctx, next) {
  if (ctx.url.includes('png')) {
    try {
      const file = fs.readFileSync(ctx.url)
      ctx.set('content-type', 'image/png')
      ctx.body = file
    } catch (error) {
      // console.log(error)
    }
  } else {
    return await next()
  }
}

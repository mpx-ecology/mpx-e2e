import Application from 'koa';

import httpRequest from './https-helper';
// const httpRequest = require('./https-helper');
const urlGenerator = (u:string, p = 'https://') => p + u

function proxyMiddleware (mockMap: Map<string, any>) {
  return async (ctx:Application.DefaultContext, next:Application.Next): Promise<any> => {

    let { request } = ctx;
    let { method, url, header } = request;
    let originHost = header.mpx_origin_host;
    let urlWithoutQuery = url.slice(0, url.indexOf('?'))
    // console.log('originHost ====> ', urlWithoutQuery, mockMap.has(originHost + urlWithoutQuery))
    if (mockMap.has(originHost + urlWithoutQuery)) {
      console.log(`【mockMap】->`, originHost + urlWithoutQuery, mockMap.has(originHost + urlWithoutQuery));
      ctx.body = mockMap.get(originHost + urlWithoutQuery)
    } else {
      try {
        header.host = originHost;
        // console.log('httpRequest ====> ', originHost + url)
        let res = await httpRequest(urlGenerator(originHost + url), header, request.body, method);
        // console.log('httpRequest ====> ', res)
        ctx.body = res
        // await next()
      } catch (e) {
        ctx.body = {
          errno: '9527',
          errmsg: e
        }
      }
      await next()
    }
  }
}

export default proxyMiddleware

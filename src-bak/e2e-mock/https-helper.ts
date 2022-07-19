const https = require('https');
let querystring = require('querystring');
import { Buffer } from 'buffer';
const HttpsHelper = function (url:string, headers:Record<any, any>, data:Record<string, any>, method = 'GET'): Promise<any> {
  let postData = method?.toUpperCase() === 'POST' ? querystring.stringify(data) : ''
  return new Promise((resolve, reject) => {
    let client = https.request(url, {
      method,
      headers: Object.assign(headers, {
        'Content-Length': postData.length
      })
    }, (res:any) => {
      let buf:Buffer | null = Buffer.from('');
      let r:Record<string, any>
      res.on('data', (d:any) => {
        buf = Buffer.isBuffer(d)
          ? Buffer.concat([(buf as Buffer), d])
          : Buffer.concat([(buf as Buffer), Buffer.from(d)])
      });
      res.on('end', () => {
        try {
          r = JSON.parse((buf as Buffer).toString());
          buf = null;
          return resolve(r)
        } catch (e) {
          buf = null
          r = { code: -1, errmsg: e }
        }
        reject(r)
      })
    })
    client.on('error', (e:Error) => reject(e));
    client.write(postData);
    client.end();
  })
}

export default HttpsHelper

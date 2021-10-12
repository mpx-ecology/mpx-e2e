const https = require('https');
let querystring = require('querystring');
import buffer, {Buffer} from 'buffer';
const HttpsHelper = function (url:string, headers:any, data:Record<string, any>, method = 'GET') {
  let postData = method?.toUpperCase() === 'POST' ? querystring.stringify(data) : ''
  return new Promise((resolve, reject) => {
    let client = https.request(url, {
      method,
      headers: Object.assign(headers, {
        'Content-Length': postData.length
      })
    }, (res:any) => {
      let buf:buffer.Buffer | null = Buffer.from('');
      let r:Record<string, any>
      res.on('data', (d:any) => {
        buf = Buffer.isBuffer(d)
          ? Buffer.concat([(buf as buffer.Buffer), d])
          : Buffer.concat([(buf as buffer.Buffer), Buffer.from(d)])
      });
      res.on('end', () => {
        try {
          r = JSON.parse((buf as buffer.Buffer).toString());
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

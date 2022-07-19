const https = require('https');
let querystring = require('querystring');
const HttpsHelper = function (url, headers, data, method = 'GET') {
  let postData = method?.toUpperCase() === 'POST' ? querystring.stringify(data) : ''
  return new Promise((resolve, reject) => {
    let client = https.request(url, {
      method,
      headers: Object.assign(headers, {
        'Content-Length': postData.length
      })
    }, (res) => {
      let buf = Buffer.from('');
      let r;
      res.on('data', (d) => {
        buf = Buffer.isBuffer(d)
          ? Buffer.concat([buf, d])
          : Buffer.concat([buf, Buffer.from(d)])
      });
      res.on('end', () => {
        try {
          r = JSON.parse((buf).toString());
          buf = null;
          return resolve(r)
        } catch (e) {
          buf = null
          r = { code: -1, errmsg: e }
        }
        reject(r)
      })
    })
    client.on('error', (e) => reject(e));
    client.write(postData);
    client.end();
  })
}

module.exports = HttpsHelper

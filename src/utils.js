const http = require('http');

exports.pushImg = pushImg;
exports.pushExpect = pushExpect;
exports.pushJSError = pushJSError;
exports.pushSystemInfo = pushSystemInfo;


function pushImg (params) {
  const req = http.request({
    port: 8886,
    method: 'POST',
    hostname: 'localhost',
    path: '/common/imgList',
    headers: {
      'Content-Type': 'application/json',
    }
  }, () => {
    // console.log('发送成功')
  })
  req.write(JSON.stringify(params))
  req.end()
}

function pushExpect () {
  const req = http.request({
    port: 8886,
    method: 'POST',
    hostname: 'localhost',
    path: '/common/expectList',
    headers: {
      'Content-Type': 'application/json',
    }
  }, () => {
    // console.log('发送成功')
  })
  // req.write(JSON.stringify(params))
  req.end()
}

function pushJSError (params) {
  const req = http.request({
    port: 8886,
    method: 'POST',
    hostname: 'localhost',
    path: '/common/errorList',
    headers: {
      'Content-Type': 'application/json',
    }
  }, () => {
    // console.log('error发送成功')
  })
  req.write(JSON.stringify(params))
  req.end()
}

function pushSystemInfo (params) {
  const req = http.request({
    port: 8886,
    method: 'POST',
    hostname: 'localhost',
    path: '/common/systemInfo',
    headers: {
      'Content-Type': 'application/json',
    }
  }, () => {
    // console.log('发送成功')
  })
  req.write(JSON.stringify(params))
  req.end()
}

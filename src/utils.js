const http = require('http');
const path = require('path')
const e2erc = require(path.join(process.cwd(), './.e2erc.js'));

exports.pushImg = pushImg;
exports.pushExpect = pushExpect;
exports.pushJSError = pushJSError;
exports.pushSystemInfo = pushSystemInfo;
exports.e2erc = e2erc

const port = e2erc.devServer.port || 8886

function pushImg (params) {
  const req = http.request({
    port: port,
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
    port: port,
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
    port: port,
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
    port: port,
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

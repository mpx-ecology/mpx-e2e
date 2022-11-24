const http = require('http');
const path = require('path')
const e2erc = require(path.join(process.cwd(), './.e2erc.js'));
const net = require('net')

exports.pushImg = pushImg;
exports.pushExpect = pushExpect;
exports.pushJSError = pushJSError;
exports.pushSystemInfo = pushSystemInfo;
exports.e2erc = e2erc

const port = e2erc.devServer.port || 8886

let cache = 0
let isCheck = false
function checkPortUsable(port) {
  if (isCheck) return cache
  return new Promise((resolve) => {
    const server = net.createConnection({ port });
    server.on('connect', () => {
      server.end();
      // reject(`Port ${port} is not available!`);
      isCheck = true
      cache = port
      resolve(port)
    });
    server.on('error', () => {
      isCheck = true
      cache = 0
      resolve(0);
    });
  });
}

async function pushImg (params) {
  const hasServer = await checkPortUsable(port)
  if (!hasServer) return
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

async function pushExpect () {
  const hasServer = await checkPortUsable(port)
  if (!hasServer) return
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

async function pushJSError (params) {
  const hasServer = await checkPortUsable(port)
  if (!hasServer) return
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

async function pushSystemInfo (params) {
  const hasServer = await checkPortUsable(port)
  if (!hasServer) return
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

const http = require('http');

const imgList = [];

exports.imgList = imgList;
exports.pushImg = pushImg;
exports.pushExpect = pushExpect;

function pushImg (params) {
  imgList.push(params)
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

const fs = require('fs');
const path = require('path');
const http = require('http');

const imgList = [];

exports.imgList = imgList;
exports.pushImg = pushImg;
exports.emitFile = emitFile;

function pushImg (params) {
  imgList.push(params)
  // axios.post('http://localhost:8886/common/imgList', {imgList})
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

function emitFile () {
  try {
    const dist = path.resolve(__dirname, './testResult.json')
    const oldFile = fs.readFileSync(dist, 'utf8')
    const data = JSON.parse(oldFile)
    data.imgList = imgList
    fs.writeFileSync(dist, JSON.stringify(data))
  } catch (error) {
    console.log(error)
  }
}

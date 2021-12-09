// 测试 mock server 的脚本
let { default: E2eMock } = require('./e2e-mock-server');
let path = require('path');

let m = new E2eMock({
  staticDir: path.resolve(__dirname, '../static-dir'),
  port: 8887
});

// 调用 setMock 添加 mock 数据
m.setMock('https://api.hongyibo.com.cn/gulfstream/pre-sale/v1/other/pGetIndexInfo', {
  errno: 0,
  errmsg: 'mock-index-info',
  data: {
    a: 1,
    b: 2,
    c: 3
  }
});

let reqdline = require('readline');
let cli = reqdline.createInterface({
  input: process.stdin,
  output: process.stdout,
  shell: 'inherit'
});

// 调试时可以通过 cli 删除 mock-map 中已经存在的映射
// 同理还可以设计添加、替换 mock map 的操作
function makeQ() {
  cli.question('type path to remove mock from mock-server-map:\r\n', (i) => {
    console.warn(i);
    if (!m.removeMockFromMap(i)) console.error(`remove path: ${i} failed!!!!!`);
    else console.log(`path: ${i} has been removed from mock-map!`);
    makeQ();
  })
}

setTimeout(() => {
  makeQ()
  // m.shutdown()
}, 5000)

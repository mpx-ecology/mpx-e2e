#!/usr/bin/env node

// eslint-disable-next-line no-undef
const program = require('commander');

program
  .option('-pt, --port <char>', 'port need, default 8886')
  .option('-d, --debug', 'output debug log')
  .option('-ph, --path <char>', 'auto open with the path')
  .option('-o, --open', '')
  .parse(process.argv);

program.url && console.log(`即将自动打开：${program.url}`);

const path = require('path');
const pkgPath = path.resolve(__dirname, './report-server/server')
const PluginReport = require(pkgPath);
const app = new PluginReport({
  port: 8886,
  open: true,
  debug: true, // 输出调试信息，仅通过该脚本时输出
  url: program.url
});

app.apply({
  port: program.port || 8886,
  open: program.open || true,
  path: program.path
})

app.done()

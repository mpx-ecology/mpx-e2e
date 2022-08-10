#!/usr/bin/env node

// eslint-disable-next-line no-undef
const program = require('commander');

program
  .option('-p, --port <char>', 'port need, default 8886')
  .option('-d, --debug', 'output debug log')
  .option('-u, --url <char>', 'auto open with the path')
  .option('-o, --open', 'open browser automatically')
  .parse(process.argv);

program.url && console.log(`即将自动打开：${program.url}`);

let { port = 8886, url , debug = true, open } = program;

const path = require('path');
const pkgPath = path.resolve(__dirname, './report-server/server')
const PluginReport = require(pkgPath);
let cfg = {
  port,
  open,
  debug, // 输出调试信息，仅通过该脚本时输出
  url
};

const app = new PluginReport(cfg);

app.apply(cfg);

app.done()

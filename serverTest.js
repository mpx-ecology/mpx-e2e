#!/usr/bin/env node

// eslint-disable-next-line no-undef
const path = require('path');
const pkgPath = path.resolve(__dirname, './report-server/server')
const PluginReport = require(pkgPath);
const app = new PluginReport({
  port: 8886,
  open: true,
  debug: true // 输出调试信息，仅通过该脚本时输出
})
app.apply({
  port: 8886,
  open: true
})

app.done()

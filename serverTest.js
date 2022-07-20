#!/usr/bin/env/ node
// eslint-disable-next-line no-undef
const PluginReport = require('./report-server/server');
const app = new PluginReport({
  port: 8886,
  open: true
})
app.apply({
  port: 8886,
  open: true
})

app.done()

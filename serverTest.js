// eslint-disable-next-line no-undef
const PluginReport = require('./lib/plugin-report')

const app = new PluginReport({
  port: 8886,
  open: true
})
app.apply({
  port: 8886,
  open: true
})

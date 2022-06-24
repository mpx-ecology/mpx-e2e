// eslint-disable-next-line no-undef
const PluginReport = require('./lib/plugin-report')

const app = new PluginReport()
app.apply({
  port: 8886,
  open: true
})

app.done()

// eslint-disable-next-line no-undef
console.log('服务：http://localhost:8886/')

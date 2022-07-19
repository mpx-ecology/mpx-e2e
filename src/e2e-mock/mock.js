const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const staticMock = require('./static-middleware');
const proxyMiddle = require('./proxy-middleware');

class E2eMock {
  constructor (cfg = { staticDir: '', port: 8887 }) {
    this.staticDir = cfg.staticDir;
    this.server = null;
    this.engineStart(cfg.port);
  }
  engineStart (port = 8887) {
    if (this.server) {
      console.warn('the last server has been shutdown!!! a new server will start soon!!!');
    }
    const app = new Koa();
    app.use(bodyParser()); // enable bdp

    // enable static mock
    this.staticDir && app.use(staticMock(this.staticDir))

    app.use(proxyMiddle(this.mockMap));

    this.connection = app.listen(port, () => console.log(port + ' has been running!!!'));
    this.server = app
  }
  shutdown () {
    this.connection?.close(console.log.bind(console, 'Mock Server has shutdown'))
  }
  setMock (path, res) {
    let pathWithoutProtocol = path.slice(8);
    if (!this.mockMap.has(pathWithoutProtocol)) {
      this.mockMap.set(pathWithoutProtocol, res);
      console.log(pathWithoutProtocol, res, this.mockMap);
      return this.mockMap.delete.bind(this.mockMap, pathWithoutProtocol)
    } else {
      console.log(`the ${path} has already existed in mock-map, please remove it before setting again!`)
    }
  }
  removeMockFromMap (path) {
    let pathWithoutProtocol = path.slice(8);
    if (this.mockMap.has(pathWithoutProtocol)) {
      return this.mockMap.delete(pathWithoutProtocol)
    }
    return false
  }
}

module.exports = E2eMock


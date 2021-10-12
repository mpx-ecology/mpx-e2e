import Application from 'koa';
import staticMock from './static-middleware';
import proxyMiddle from './proxy-middleware';
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
// const staticMock = require('./static-middleware');
// const proxyMiddle = require('./proxy-middleware');

export interface E2eMockConfig {
  // useStatic: boolean,
  staticDir: string,
  debug: boolean
}

class E2eMock {
  // public useStatic: boolean
  public staticDir: string
  public debug: boolean
  public mockMap = new Map()
  public server: Application | null
  constructor (cfg:E2eMockConfig = { staticDir: '', debug: false }) {
    // this.useStatic = cfg.useStatic;
    this.staticDir = cfg.staticDir;
    this.debug = cfg.debug;
    this.server = null
    this.engineStart();
  }
  engineStart (port = 8887) {
    if (this.server) {
      console.warn('the last server has been shutdown!!! a new server will start soon!!!');
      // this.server.close()
    }
    const app = new Koa();
    app.use(bodyParser()); // enable bdp

    // enable static mock
    this.staticDir && app.use(staticMock(this.staticDir))

    app.use(proxyMiddle(this.mockMap));

    app.listen(port, () => console.log('8887 has been running!!!'));
    this.server = app
  }
  setMock (path: string, res: any) {
    let pathWithoutProtocol:string = path.slice(8);
    if (!this.mockMap.has(pathWithoutProtocol)) {
      this.mockMap.set(pathWithoutProtocol, res);
      console.log(pathWithoutProtocol, res, this.mockMap);
      return this.mockMap.delete.bind(this.mockMap, pathWithoutProtocol)
    } else {
      console.log(`the ${path} has already existed in mock-map, please remove it before setting again!`)
    }
  }
  removeMockFromMap (path:string) {
    let pathWithoutProtocol:string = path.slice(8);
    if (this.mockMap.has(pathWithoutProtocol)) {
      return this.mockMap.delete(pathWithoutProtocol)
    }
    return false
  }
}

// module.exports = E2eMock

export default E2eMock


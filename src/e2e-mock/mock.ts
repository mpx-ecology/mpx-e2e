import Application from 'koa';
import staticMock from './static-middleware';
import proxyMiddle from './proxy-middleware';
import { Server } from 'http';
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
// const staticMock = require('./static-middleware');
// const proxyMiddle = require('./proxy-middleware');

export interface E2eMockConfig {
  // useStatic: boolean,
  staticDir?: string,
  port?: number
  setProxy?: any[]
  // debug: boolean
}
type mockReturnType = void | (() => boolean)

class E2eMock {
  // public useStatic: boolean
  public staticDir: string | void
  // public debug: boolean
  public mockMap = new Map()
  public server: Application | null
  public connection: Server | undefined
  constructor (cfg:E2eMockConfig = { staticDir: '', port: 8887 }) {
    // this.useStatic = cfg.useStatic;
    this.staticDir = cfg.staticDir;
    // this.debug = cfg.debug;
    this.server = null;
    this.engineStart(cfg.port);
  }
  engineStart (port = 8887): void {
    if (this.server) {
      console.warn('the last server has been shutdown!!! a new server will start soon!!!');
      // this.server.close()
    }
    const app = new Koa();
    app.use(bodyParser()); // enable bdp

    // enable static mock
    this.staticDir && app.use(staticMock(this.staticDir))

    app.use(proxyMiddle(this.mockMap));

    this.connection = app.listen(port, () => console.log(port + ' has been running!!!'));
    this.server = app
  }
  shutdown ():void {
    this.connection?.close(console.log.bind(console, 'Mock Server has shutdown'))
  }
  setMock (path: string, res: Record<string, any>): mockReturnType {
    let pathWithoutProtocol:string = path.slice(8);
    if (!this.mockMap.has(pathWithoutProtocol)) {
      this.mockMap.set(pathWithoutProtocol, res);
      console.log(pathWithoutProtocol, res, this.mockMap);
      return this.mockMap.delete.bind(this.mockMap, pathWithoutProtocol)
    } else {
      console.log(`the ${path} has already existed in mock-map, please remove it before setting again!`)
    }
  }
  removeMockFromMap (path:string): boolean {
    let pathWithoutProtocol:string = path.slice(8);
    if (this.mockMap.has(pathWithoutProtocol)) {
      return this.mockMap.delete(pathWithoutProtocol)
    }
    return false
  }
}

// module.exports = E2eMock

export default E2eMock


import Application from 'koa';
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const staticMock = require('./static-middleware');
const proxyMiddle = require('./proxy-middleware');

export interface E2eMockConfig {
  useStatic: boolean,
  staticDir: string,
  debug: boolean
}

class E2eMock {
  public useStatic: boolean
  public staticDir: string
  public debug: boolean
  public mockMap = new Map()
  public server: Application | null
  constructor (cfg:E2eMockConfig = { useStatic: false, staticDir: '', debug: false }) {
    this.useStatic = cfg.useStatic;
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
    if (this.useStatic) {
      this.staticDir
        ? app.use(staticMock(this.staticDir))
        : console.error(`"staticDir" is required when enable "useStatic", Please check "useStatic" is necessary or not!`)
    }
    app.use(proxyMiddle(this.mockMap));

    app.listen(port, () => console.log('8887 has been running!!!'))
    this.server = app
  }
  setMock (path: string, res: any) {
    let pathWithoutProtocol:string = path.slice(path.indexOf('https://'))
    if (!this.mockMap.has(pathWithoutProtocol)) {
      this.mockMap.set(pathWithoutProtocol, res)
      return this.mockMap.delete.bind(this.mockMap, pathWithoutProtocol)
    }
  }
}

// module.exports = E2eMock

export default E2eMock


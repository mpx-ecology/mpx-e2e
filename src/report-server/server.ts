import * as Application from 'koa';
import koaStatic from 'koa-static';
import { Server } from 'http';
import * as path from 'path';
import open from 'open';
import { handleCors, handleImg } from './util'
import common from './route/common';

const Koa = require('koa');

export interface E2eServerConfig {
  staticDir?: string,
  port?: number
  setProxy?: any[]
}

class E2eMock {
  public staticDir: string | void
  public mockMap = new Map()
  public server: Application | null
  public connection: Server | undefined
  constructor (cfg:E2eServerConfig = { staticDir: '', port: 8886 }) {
    this.staticDir = cfg.staticDir;
    this.server = null;
    this.engineStart(cfg.port);
  }
  engineStart (port = 8886): void {
    if (this.server) {
      console.warn('the last server has been shutdown!!! a new server will start soon!!!');
      // this.server.close()
      return
    }

    const app = new Koa();

    app.use(koaStatic(path.resolve(__dirname, '../report-client/dist')));
    app.use(handleCors)
    app.use(handleImg)
    app.use(common.routes(), common.allowedMethods())


    this.connection = app.listen(port, () => {
      // console.log(`Starting up E2E server! ( http://localhost:${port}/ )`)
    });

    open(`http://localhost:${port}/`)
    this.server = app
    
  }
  shutdown ():void {
    this.connection?.close(console.log.bind(console, 'E2E server has shutdown'))
  }
}

export default E2eMock

import koaStatic from 'koa-static';
import path from 'path';
import openBrowser from 'open';
import { WebSocketServer } from 'ws';
import { handleCors, handleImg } from './util'
import common from './route/common';
import bodyParser from 'koa-bodyparser';
import fs from 'fs';
import generateRouter from './route/generate'
import Koa from 'koa'

// const Koa = require('koa');

class E2eServer {
  constructor () {
    this.server = null;
    this.isServer = true;
    this.cfg = { open: true, port: 8886 }
  }
  apply (cfg) {
    // eslint-disable-next-line no-undef
    const dist = path.resolve(__dirname, './testResult.json')
    fs.writeFileSync(dist, JSON.stringify({ reportList: [], imgList: [] }))
    this.cfg = Object.assign(this.cfg, cfg)
    const { port = 8886 } = cfg
    if (this.server) {
      // console.warn('the last server has been shutdown!!! a new server will start soon!!!');
      // this.server.close()
      return
    }

    const app = new Koa();
    app.use(bodyParser());
    // eslint-disable-next-line no-undef
    app.use(koaStatic(path.resolve(__dirname, '../report-client/dist')));
    app.use(handleCors);
    app.use(handleImg);
    app.use(common.routes(), common.allowedMethods());
    app.use(generateRouter.routes())


    this.connection = app.listen(port, () => {
      // console.log(`Starting up E2E server! ( http://localhost:${port}/ )`)
    });
    // if (open) {
    //   openBrowser(`http://localhost:${port}/`)
    // }
    this.server = app
    this.initWebsocket()
  }
  done () {
    if (this.cfg.open) {
      openBrowser(`http://localhost:${this.cfg.port}/`)
    }
  }
  shutdown () {
    this.connection?.close()
  }
  initWebsocket () {
    const wsServer = new WebSocketServer({ port: 8885 })
    wsServer.on('connection', () => {
      this.sendMessage()
    })
    this.wsServer = wsServer
  }
  sendMessage (text) {
    if (!this.wsServer) return
    if (text) {
      this.messageList.push(text)
      this.wsServer.clients.forEach(socket => {
        socket.send(JSON.stringify([text]))
      })
      return
    }
    this.wsServer.clients.forEach(socket => {
      socket.send(JSON.stringify(this.messageList))
    })
  }
}

// eslint-disable-next-line no-undef
module.exports = E2eServer
export default E2eServer

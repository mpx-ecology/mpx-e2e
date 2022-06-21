import * as Application from 'koa';
import koaStatic from 'koa-static';
import { Server } from 'http';
import * as path from 'path';
import openBrowser from 'open';
import WebSocket, { WebSocketServer } from 'ws';
import { handleCors, handleImg } from './util'
import common from './route/common';
import bodyParser from 'koa-bodyparser';
import * as fs from 'fs'

const Koa = require('koa');

interface E2eServerConfig {
  port?: number
  open?: boolean
}

class E2eServer {
  public mockMap = new Map()
  public server: Application | null
  public connection: Server | undefined
  public messageList = ['初始化']
  public wsServer: WebSocket.Server | undefined
  public isServer: boolean
  public cfg: E2eServerConfig
  constructor () {
    this.server = null;
    this.isServer = true;
    this.cfg = { open: true, port: 8886 }
  }
  apply (cfg: E2eServerConfig): void {
    const dist = path.resolve(__dirname, './testResult.json')
    fs.writeFileSync(dist, JSON.stringify({}))
    this.cfg = Object.assign(this.cfg, cfg)
    const { port = 8886 } = cfg
    if (this.server) {
      console.warn('the last server has been shutdown!!! a new server will start soon!!!');
      // this.server.close()
      return
    }

    const app = new Koa();
    app.use(bodyParser())
    app.use(koaStatic(path.resolve(__dirname, '../report-client/dist')));
    app.use(handleCors)
    app.use(handleImg)
    app.use(common.routes(), common.allowedMethods())


    this.connection = app.listen(port, () => {
      // console.log(`Starting up E2E server! ( http://localhost:${port}/ )`)
    });
    // if (open) {
    //   openBrowser(`http://localhost:${port}/`)
    // }
    this.server = app
    this.initWebsocket()
  }
  done ():void {
    if (this.cfg.open) {
      openBrowser(`http://localhost:${this.cfg.port}/`)
    }
  }
  shutdown ():void {
    this.connection?.close(console.log.bind(console, 'E2E server has shutdown'))
  }
  initWebsocket ():void {
    const wsServer = new WebSocketServer({ port: 8885 })
    wsServer.on('connection', () => {
      this.sendMessage()
    })
    this.wsServer = wsServer
  }
  sendMessage (text?: string): void {
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

module.exports = E2eServer
export default E2eServer
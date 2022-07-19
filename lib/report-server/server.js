"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_static_1 = __importDefault(require("koa-static"));
var path = __importStar(require("path"));
var open_1 = __importDefault(require("open"));
var ws_1 = require("ws");
var util_1 = require("./util");
var common_1 = __importDefault(require("./route/common"));
var koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
var fs = __importStar(require("fs"));
var generate_1 = __importDefault(require("./route/generate"));
var Koa = require('koa');
var E2eServer = /** @class */ (function () {
    function E2eServer() {
        this.messageList = ['初始化'];
        this.server = null;
        this.isServer = true;
        this.cfg = { open: true, port: 8886 };
    }
    E2eServer.prototype.apply = function (cfg) {
        var dist = path.resolve(__dirname, './testResult.json');
        fs.writeFileSync(dist, JSON.stringify({ reportList: [], imgList: [] }));
        this.cfg = Object.assign(this.cfg, cfg);
        var _a = cfg.port, port = _a === void 0 ? 8886 : _a;
        if (this.server) {
            console.warn('the last server has been shutdown!!! a new server will start soon!!!');
            // this.server.close()
            return;
        }
        var app = new Koa();
        app.use(koa_bodyparser_1.default());
        app.use(koa_static_1.default(path.resolve(__dirname, '../report-client/dist')));
        app.use(util_1.handleCors);
        app.use(util_1.handleImg);
        app.use(common_1.default.routes(), common_1.default.allowedMethods());
        app.use(generate_1.default.routes());
        this.connection = app.listen(port, function () {
            // console.log(`Starting up E2E server! ( http://localhost:${port}/ )`)
        });
        // if (open) {
        //   openBrowser(`http://localhost:${port}/`)
        // }
        this.server = app;
        this.initWebsocket();
    };
    E2eServer.prototype.done = function () {
        if (this.cfg.open) {
            open_1.default("http://localhost:" + this.cfg.port + "/");
        }
    };
    E2eServer.prototype.shutdown = function () {
        var _a;
        (_a = this.connection) === null || _a === void 0 ? void 0 : _a.close(console.log.bind(console, 'E2E server has shutdown'));
    };
    E2eServer.prototype.initWebsocket = function () {
        var _this = this;
        var wsServer = new ws_1.WebSocketServer({ port: 8885 });
        wsServer.on('connection', function () {
            _this.sendMessage();
        });
        this.wsServer = wsServer;
    };
    E2eServer.prototype.sendMessage = function (text) {
        var _this = this;
        if (!this.wsServer)
            return;
        if (text) {
            this.messageList.push(text);
            this.wsServer.clients.forEach(function (socket) {
                socket.send(JSON.stringify([text]));
            });
            return;
        }
        this.wsServer.clients.forEach(function (socket) {
            socket.send(JSON.stringify(_this.messageList));
        });
    };
    return E2eServer;
}());
module.exports = E2eServer;
exports.default = E2eServer;

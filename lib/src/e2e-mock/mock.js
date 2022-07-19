"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var static_middleware_1 = __importDefault(require("./static-middleware"));
var proxy_middleware_1 = __importDefault(require("./proxy-middleware"));
var Koa = require('koa');
var bodyParser = require('koa-bodyparser');
var E2eMock = /** @class */ (function () {
    function E2eMock(cfg) {
        if (cfg === void 0) { cfg = { staticDir: '', port: 8887 }; }
        // public debug: boolean
        this.mockMap = new Map();
        // this.useStatic = cfg.useStatic;
        this.staticDir = cfg.staticDir;
        // this.debug = cfg.debug;
        this.server = null;
        this.engineStart(cfg.port);
    }
    E2eMock.prototype.engineStart = function (port) {
        if (port === void 0) { port = 8887; }
        if (this.server) {
            console.warn('the last server has been shutdown!!! a new server will start soon!!!');
            // this.server.close()
        }
        var app = new Koa();
        app.use(bodyParser()); // enable bdp
        // enable static mock
        this.staticDir && app.use(static_middleware_1.default(this.staticDir));
        app.use(proxy_middleware_1.default(this.mockMap));
        this.connection = app.listen(port, function () { return console.log(port + ' has been running!!!'); });
        this.server = app;
    };
    E2eMock.prototype.shutdown = function () {
        var _a;
        (_a = this.connection) === null || _a === void 0 ? void 0 : _a.close(console.log.bind(console, 'Mock Server has shutdown'));
    };
    E2eMock.prototype.setMock = function (path, res) {
        var pathWithoutProtocol = path.slice(8);
        if (!this.mockMap.has(pathWithoutProtocol)) {
            this.mockMap.set(pathWithoutProtocol, res);
            console.log(pathWithoutProtocol, res, this.mockMap);
            return this.mockMap.delete.bind(this.mockMap, pathWithoutProtocol);
        }
        else {
            console.log("the " + path + " has already existed in mock-map, please remove it before setting again!");
        }
    };
    E2eMock.prototype.removeMockFromMap = function (path) {
        var pathWithoutProtocol = path.slice(8);
        if (this.mockMap.has(pathWithoutProtocol)) {
            return this.mockMap.delete(pathWithoutProtocol);
        }
        return false;
    };
    return E2eMock;
}());
// module.exports = E2eMock
exports.default = E2eMock;

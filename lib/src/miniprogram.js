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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var page_1 = __importDefault(require("./page"));
var chalk = __importStar(require("chalk"));
var utils_1 = require("./utils");
var path = __importStar(require("path"));
var log = function () {
    var str = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        str[_i] = arguments[_i];
    }
    return console.log.apply(console, __spreadArray([chalk.blue.bgGreenBright.bold('【e2e-sdk】: ')], str));
};
var EMiniProgram = /** @class */ (function () {
    function EMiniProgram(options) {
        var _this = this;
        this.hasAbility = false;
        this.cachePageStack = new Set();
        this.interceptRequetStack = [];
        this.interceptResponseStack = [];
        var miniProgram = Object.create(options);
        // 重构返回page的方法，用Epage代替
        var pageStack = miniProgram.pageStack;
        miniProgram.pageStack = function () { return __awaiter(_this, void 0, void 0, function () {
            var pages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, pageStack.call(options)];
                    case 1:
                        pages = _a.sent();
                        pages = pages.length && pages.map(function (item) { return new page_1.default(item); });
                        return [2 /*return*/, pages];
                }
            });
        }); };
        var refactorFns = [
            'navigateTo', 'redirectTo', 'navigateBack',
            'reLaunch', 'switchTab', 'currentPage'
        ];
        refactorFns.forEach(function (item) {
            var fn = miniProgram[item];
            miniProgram[item] = function (url) { return __awaiter(_this, void 0, void 0, function () {
                var page;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fn.call(options, url)];
                        case 1:
                            page = _a.sent();
                            return [2 /*return*/, new page_1.default(page)];
                    }
                });
            }); };
        });
        // 新增方法
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        var that = this;
        miniProgram.wait = function () {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return (_a = _this.wait).call.apply(_a, __spreadArray([that], args));
        };
        miniProgram.waitAll = function () {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return (_a = _this.waitAll).call.apply(_a, __spreadArray([that], args));
        };
        miniProgram.currentPagePath = function () { return _this.currentPagePath.call(that); };
        miniProgram.addInterceptRequest = function (fn) { return _this.interceptRequetStack.push(fn); };
        miniProgram.addInterceptResponse = function (fn) { return _this.interceptResponseStack.push(fn); };
        miniProgram.init = function (iniCfg) { return _this.init.call(that, iniCfg); };
        var screenshot = miniProgram.screenshot;
        miniProgram.screenshot = function (options) { return __awaiter(_this, void 0, void 0, function () {
            var src;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, screenshot.call(miniProgram, options)];
                    case 1:
                        _a.sent();
                        src = path.join(process.cwd(), options.path);
                        utils_1.pushImg({ path: options.path, src: src });
                        return [2 /*return*/];
                }
            });
        }); };
        this.miniProgram = miniProgram;
        // 初始化与appservice交互
        return miniProgram;
    }
    /** 返回当前页面路径 */
    EMiniProgram.prototype.currentPagePath = function () {
        return __awaiter(this, void 0, void 0, function () {
            var curPage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.miniProgram.currentPage()];
                    case 1:
                        curPage = _a.sent();
                        return [2 /*return*/, curPage ? curPage.path : curPage];
                }
            });
        });
    };
    /** 可以等待五种种类型 页面 发请求 请求返回 组件渲染 组件更新 */
    EMiniProgram.prototype.wait = function (path, type) {
        var _this = this;
        if (type === void 0) { type = 'page'; }
        if (!this.hasAbility)
            return log(chalk.red.bold('由于在app上未注册mixin,xfetch导致初始化未完成，wait能力无法支持'));
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var _a, curPath, doudiTimer_1, resolvep;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (type === 'page' && /^(http|\/)/g.test(path)) {
                            type = 'response';
                        }
                        _a = type;
                        switch (_a) {
                            case 'page': return [3 /*break*/, 1];
                            case 'request': return [3 /*break*/, 3];
                            case 'response': return [3 /*break*/, 4];
                            case 'component': return [3 /*break*/, 5];
                            case 'componentUpdate': return [3 /*break*/, 6];
                        }
                        return [3 /*break*/, 7];
                    case 1: return [4 /*yield*/, this.currentPagePath()
                        // wait的是当前页面直接返回
                    ];
                    case 2:
                        curPath = _b.sent();
                        // wait的是当前页面直接返回
                        if (curPath === path) {
                            log(chalk.green('wait成功!=>' + path + '(page)'));
                            return [2 /*return*/, resolve(path)];
                        }
                        doudiTimer_1 = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                            var curPath;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.currentPagePath()];
                                    case 1:
                                        curPath = _a.sent();
                                        if (curPath === path) {
                                            log(chalk.green('兜底成功!=>' + path + '(page)'));
                                            return [2 /*return*/, resolve(path)];
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 3000);
                        resolvep = function (data) {
                            clearTimeout(doudiTimer_1);
                            return resolve(data);
                        };
                        this.curWaitPage = {
                            path: path,
                            resolve: resolvep
                        };
                        return [3 /*break*/, 8];
                    case 3:
                        this.curWaitRequest = {
                            path: path,
                            resolve: resolve
                        };
                        return [3 /*break*/, 8];
                    case 4:
                        this.curWaitResponse = {
                            path: path,
                            resolve: resolve
                        };
                        return [3 /*break*/, 8];
                    case 5:
                        this.curWaitComponent = {
                            path: path,
                            resolve: resolve
                        };
                        return [3 /*break*/, 8];
                    case 6:
                        {
                            this.curWaitComponentUpdate = {
                                path: path,
                                resolve: resolve
                            };
                        }
                        return [3 /*break*/, 8];
                    case 7: return [3 /*break*/, 8];
                    case 8:
                        log(chalk.yellow('当前wait=> type ' + type + ' ' + path));
                        return [2 /*return*/];
                }
            });
        }); });
    };
    EMiniProgram.prototype.waitAll = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return Promise.all(__spreadArray([], args));
    };
    /** 打印元素日志 */
    EMiniProgram.prototype.consoleWxml = function (element) {
        element && element.wxml().then(function (data) { return console.log(data); });
    };
    /** 初始化工作 */
    EMiniProgram.prototype.init = function (initCfg) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var mockCfg, setProxy, interceptorCfg, requestInterceptors, responseInterceptors, functionStr;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // console.log('initCfg ------>>>>>', initCfg)
                        log(chalk.blue.bold('初始化开始'));
                        /** 监听页面渲染，需要ready搭配show生命周期 还有unload来完成页面等待 */
                        return [4 /*yield*/, this.miniProgram.exposeFunction('onPageReady', function (options) {
                                var _a = _this, curWaitPage = _a.curWaitPage, cachePageStack = _a.cachePageStack;
                                if (curWaitPage && curWaitPage.path === options) {
                                    curWaitPage.path = '';
                                    curWaitPage.resolve(options);
                                    log(chalk.green('wait成功!=>' + options + '(page)'));
                                }
                                if (!cachePageStack.has(options)) {
                                    cachePageStack.add(options);
                                }
                            })];
                    case 1:
                        /** 监听页面渲染，需要ready搭配show生命周期 还有unload来完成页面等待 */
                        _c.sent();
                        return [4 /*yield*/, this.miniProgram.exposeFunction('onPageShow', function (options) {
                                var _a = _this, curWaitPage = _a.curWaitPage, cachePageStack = _a.cachePageStack;
                                if (curWaitPage && curWaitPage.path === options && cachePageStack.has(options)) {
                                    log(chalk.green('wait成功!=>' + options + '(page)'));
                                    curWaitPage.path = '';
                                    curWaitPage.resolve(options);
                                }
                            })];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, this.miniProgram.exposeFunction('onPageUnload', function (options) {
                                var cachePageStack = _this.cachePageStack;
                                if (cachePageStack.has(options)) {
                                    cachePageStack.delete(options);
                                    log(chalk.gray('页面卸载=>' + options));
                                }
                            })
                            /** 请求相关的等待实现 */
                        ];
                    case 3:
                        _c.sent();
                        /** 请求相关的等待实现 */
                        return [4 /*yield*/, this.miniProgram.exposeFunction('onXfetchRequest', function (options) {
                                var _a = _this, curWaitRequest = _a.curWaitRequest, interceptRequetStack = _a.interceptRequetStack;
                                var url = options.url && options.url.split('?')[0];
                                if (curWaitRequest && curWaitRequest.path === url) {
                                    curWaitRequest.path = '';
                                    curWaitRequest.resolve({ url: url, options: options });
                                    log(chalk.green('wait成功!=>' + url + '(request)'));
                                }
                                interceptRequetStack.forEach(function (item) {
                                    if (typeof item === 'function') {
                                        item(options);
                                    }
                                });
                            })];
                    case 4:
                        /** 请求相关的等待实现 */
                        _c.sent();
                        return [4 /*yield*/, this.miniProgram.exposeFunction('onXfetchResponse', function (options) {
                                var url = options.requestConfig && options.requestConfig.url && options.requestConfig.url.split('?')[0];
                                var _a = _this, curWaitResponse = _a.curWaitResponse, interceptResponseStack = _a.interceptResponseStack;
                                // console.log('onXfetchResponse', curWaitResponse?.path, url?.includes(curWaitResponse?.path))
                                if (curWaitResponse && (curWaitResponse === null || curWaitResponse === void 0 ? void 0 : curWaitResponse.path) && (url === null || url === void 0 ? void 0 : url.includes(curWaitResponse.path))) {
                                    curWaitResponse.path = '';
                                    curWaitResponse.resolve({ url: url, options: options });
                                    log(chalk.green('wait成功!=>' + url + '(response)'));
                                }
                                interceptResponseStack.forEach(function (item) {
                                    if (typeof item === 'function') {
                                        item(options);
                                    }
                                });
                            })];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, this.miniProgram.exposeFunction('onComponentUpdate', function (options) {
                                var curWaitComponentUpdate = _this.curWaitComponentUpdate;
                                if (curWaitComponentUpdate && curWaitComponentUpdate.path === options.path) {
                                    curWaitComponentUpdate.path = '';
                                    curWaitComponentUpdate.resolve(options.data);
                                    log(chalk.green('wait成功!=>' + options.path + '(componentUpdate)'));
                                }
                            })];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, this.miniProgram.exposeFunction('onComponentReady', function (options) {
                                var curWaitComponent = _this.curWaitComponent;
                                if (curWaitComponent && curWaitComponent.path === options) {
                                    curWaitComponent.path = '';
                                    curWaitComponent.resolve(options);
                                    log(chalk.green('wait成功!=>' + options + '(component)'));
                                }
                            })];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, this.miniProgram.exposeFunction('onHasAbility', function (options) {
                                _this.hasAbility = options;
                            })];
                    case 8:
                        _c.sent();
                        mockCfg = (initCfg || {}).mockCfg;
                        setProxy = mockCfg === null || mockCfg === void 0 ? void 0 : mockCfg.setProxy;
                        setProxy = setProxy ? JSON.stringify(setProxy) : false;
                        interceptorCfg = (initCfg === null || initCfg === void 0 ? void 0 : initCfg.injectInterceptorCfg) || {};
                        requestInterceptors = ((_a = interceptorCfg.request) === null || _a === void 0 ? void 0 : _a.map(function (itm) {
                            return ";(" + !itm.preIntercept + " || " + itm.preIntercept.toString() + "()) \n                     && xfetch.interceptors.request.use(" + itm.intercept + "\n                  )";
                        })) || '';
                        responseInterceptors = ((_b = interceptorCfg.response) === null || _b === void 0 ? void 0 : _b.map(function (item) {
                            return ";(" + !item.preIntercept + " || " + item.preIntercept.toString() + "()) \n                  && xfetch.interceptors.response.use(" + item.intercept + "\n                )";
                        })) || '';
                        functionStr = "const { xfetch, mixin } = getApp().getMpx() || getApp()\n      \n        // const proxyCfg = getApp().setProxy;\n        function abilityCheck() {\n          return typeof mixin === 'function' && xfetch\n        }\n        const hasAbility = !!abilityCheck();\n        onHasAbility(hasAbility);\n        if (!hasAbility) return;\n\n        mixin({\n          onShow() {\n            // console.log('onShow ' + this.route)\n            onPageShow(this.route)\n          },\n          onUnload() {\n            onPageUnload(this.route)\n          },\n          onReady() {\n            onPageReady(this.route)\n          }\n        }, 'page');\n        mixin({\n          updated() {\n            // console.log('onUpdate ' + this.is, this.data)\n            onComponentUpdate({ data: this.data, path: this.is })\n          },\n          ready() {\n            onComponentReady(this.is)\n          }\n        }, 'component');\n\n        // console.log('proxyCfg ====>>>>>111', mockEnable.setProxy);\n        // console.log('mockEnable ===>', " + setProxy + ");\n\n        if (" + setProxy + ") {\n          let proxyCfg = " + setProxy + ";\n          let cfg = proxyCfg.map(({ test, proxy }) => {\n            let host;\n            if (test.url) {\n              let execR = (/https:\\/\\/([^/]+)/g).exec(test.url);\n              host = execR && execR[1] || '';\n            } else {\n              host = test.host;\n            }\n            if (!host) {\n              console.error(`\u3010e2e-setMoc-Error\u3011the 'url' or 'host' is required when setProxy!!!!`)\n            }\n            return {\n              test,\n              proxy: Object.assign(proxy, {\n                header: {\n                  mpx_origin_host: host\n                }\n              })\n            }\n          });\n          // console.log('cfg ===>>>>', cfg)\n          xfetch.setProxy(cfg);\n        }\n        xfetch.interceptors.request.use(function (config) {\n          onXfetchRequest(config);\n          return config\n        });\n        xfetch.interceptors.response.use(function (config) {\n          onXfetchResponse(config)\n          return config\n        });\n        " + (requestInterceptors ? requestInterceptors.join(';') : '') + "\n        " + (responseInterceptors ? responseInterceptors.join(';') : '') + "\n        ";
                        return [4 /*yield*/, this.miniProgram.evaluate(new Function(functionStr))];
                    case 9:
                        _c.sent();
                        log(chalk.blue.bold('初始化结束'));
                        return [2 /*return*/];
                }
            });
        });
    };
    return EMiniProgram;
}());
exports.default = EMiniProgram;

"use strict";
/**
 * 获取元素方法
 * @param fn 获取元素的原生方法
 * @param className 类名
 * @param componentsName 组件名拆分的数组
 * @returns 返回Promise<元素>
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
function $(fn, className, componentsName) {
    return __awaiter(this, void 0, void 0, function () {
        var componetsNameArr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (className[0] === '.') {
                        className = className.slice(1);
                    }
                    if (!!componentsName) return [3 /*break*/, 2];
                    return [4 /*yield*/, fn('.' + className)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    componetsNameArr = componentsName ? componentsName.split(/\/|-/) : [];
                    return [4 /*yield*/, _getDOM(fn, componetsNameArr, className)];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * 迭代尝试元素可能的类名，从而拿到元素，1-2次即可拿到，一般不会执行到3-4次
 * @param fn 获取元素的原生方法
 * @param componetsNameArr 组件名拆分的数组
 * @param clazz 类名
 * @param joinArr 辅助数组
 * @returns 返回Promise<元素>
 */
function _getDOM(fn, componetsNameArr, clazz, joinArr) {
    if (joinArr === void 0) { joinArr = []; }
    return __awaiter(this, void 0, void 0, function () {
        function getDOMItem() {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    // eslint-disable-next-line no-async-promise-executor
                    return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                            var s, dom, isEmptyArr, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        joinArr.unshift(probeArray.pop());
                                        s = '.' + joinArr.join('-') + '--' + clazz;
                                        return [4 /*yield*/, fn(s)
                                            // let dom = isSingle$ ? await ctx.$(s) : await ctx.$$(s)
                                            // console.log(s, dom)
                                        ];
                                    case 1:
                                        dom = _b.sent();
                                        isEmptyArr = Array.isArray(dom) && !dom.length;
                                        if ((!dom || isEmptyArr) && !probeArray.length)
                                            return [2 /*return*/, resolve(null)
                                                // console.log(dom === null, Array.isArray(dom) && !dom.length, 'Array.isArray(dom) && !dom.length')
                                                // console.log(dom)
                                            ];
                                        if (!(dom === null || isEmptyArr)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, getDOMItem().then(resolve)];
                                    case 2:
                                        _a = _b.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        _a = resolve(dom);
                                        _b.label = 4;
                                    case 4: 
                                    // console.log(dom === null, Array.isArray(dom) && !dom.length, 'Array.isArray(dom) && !dom.length')
                                    // console.log(dom)
                                    return [2 /*return*/, _a];
                                }
                            });
                        }); })];
                });
            });
        }
        var probeArray;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    probeArray = __spreadArray([], componetsNameArr);
                    return [4 /*yield*/, getDOMItem()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
var EPage = /** @class */ (function () {
    function EPage(page) {
        var _this = this;
        var new$ = page.$;
        var new$$ = page.$$;
        var newPage = Object.create(page);
        // 重写page和element的$,$$方法
        newPage.$ = function (className, componentsName) { return __awaiter(_this, void 0, void 0, function () {
            var element;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!componentsName)
                            return [2 /*return*/, new$.call(page, className)];
                        return [4 /*yield*/, $(function (s) { return new$.call(page, s); }, className, componentsName)];
                    case 1:
                        element = _a.sent();
                        return [2 /*return*/, element ? new EPage(element) : element];
                }
            });
        }); };
        newPage.$$ = function (className, componentsName) { return __awaiter(_this, void 0, void 0, function () {
            var elements;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!componentsName)
                            return [2 /*return*/, new$$.call(page, className)];
                        return [4 /*yield*/, $(function (s) { return new$$.call(page, s); }, className, componentsName)];
                    case 1:
                        elements = _a.sent();
                        if (elements && elements.length) {
                            return [2 /*return*/, elements.map(function (element) { return new EPage(element); })];
                        }
                        return [2 /*return*/, elements];
                }
            });
        }); };
        return newPage;
    }
    return EPage;
}());
exports.default = EPage;

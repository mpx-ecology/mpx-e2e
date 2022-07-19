"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
Object.defineProperty(exports, "__esModule", { value: true });
var prettier = require('prettier');
var fsOrigin = require('fs');
var path = require('path');
var tpl = require('./template');
var fs = fsOrigin.promises;
function generateSpec(e2eRc) {
    return __awaiter(this, void 0, void 0, function () {
        var testSuitsDir, projectPath, caseDir, miniTestList, files, specFileList, _i, files_1, f, minitestJson, mockRules, cmds, c, rd, tplPath, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testSuitsDir = e2eRc.testSuitsDir, projectPath = e2eRc.projectPath;
                    if (!testSuitsDir)
                        throw new Error('.e2erc.js.testSuitsDir which means spec file directory is not defined! please configure it !');
                    caseDir = path.resolve(projectPath, './minitest');
                    return [4 /*yield*/, fs.readdir(caseDir)];
                case 1:
                    miniTestList = _a.sent();
                    files = miniTestList.map(function (i) {
                        return {
                            o: i,
                            we: i.replace('.json', ''),
                            p: path.join(caseDir, i),
                            n: path.resolve(process.cwd(), "" + testSuitsDir, i.replace(/\.json/, '')) + '.spec.js'
                        };
                    });
                    specFileList = [];
                    if (!files.length)
                        throw new Error(caseDir + '目录下没有找到 json 文件！请前往模拟器录制 case： 工具 -> 自动化测试 -> 录制');
                    _i = 0, files_1 = files;
                    _a.label = 2;
                case 2:
                    if (!(_i < files_1.length)) return [3 /*break*/, 6];
                    f = files_1[_i];
                    minitestJson = require(f.p);
                    mockRules = minitestJson.commands
                        .filter(function (i) { return i.command === 'mock'; })
                        .map(function (i) { return i.rule; });
                    cmds = minitestJson.commands.filter(function (i) { return !['mock', 'startRecord', 'stopRecord'].includes(i.command); });
                    // 把文字中的换行符等过滤掉，防止意外换行导致格式化失败
                    cmds = cmds.map(function (i) { return /\n|\t|\r\n/g.test(i.text) ? __assign(__assign({}, i), { text: i.text.replace(/\n|\t|\r\n/g, ' ') }) : i; });
                    c = cmds;
                    rd = {
                        projectPath: projectPath,
                        blockPath: path.resolve(__dirname, './blocks'),
                        descName: f.we,
                        itName: f.we,
                        needRealMachine: false,
                        jestTimeout: 30000000,
                        defaultWaitFor: 10000,
                        connectUrl: 'ws://localhost:9420',
                        mockRules: (mockRules === null || mockRules === void 0 ? void 0 : mockRules.length) ? mockRules : false,
                        cmds: c,
                        macroPath: './macros',
                        item: c[0],
                        connectFirst: false, // automator 优先使用 connect 而非 launch
                    };
                    tplPath = path.resolve(__dirname, './tpl.njk');
                    res = tpl(rd);
                    return [4 /*yield*/, prettier.format(res, { semi: true, singleQuote: true, parser: 'babel' })];
                case 3:
                    res = _a.sent();
                    return [4 /*yield*/, fs.writeFile(f.n, res)];
                case 4:
                    _a.sent();
                    specFileList.push(res);
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6: return [2 /*return*/, specFileList];
            }
        });
    });
}
exports.default = generateSpec;

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
var koa_router_1 = __importDefault(require("koa-router"));
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var router = new koa_router_1.default({
    prefix: '/common'
});
router.post('/imgList', function (ctx) {
    // console.log(ctx.request.body, 'body ==>')
    try {
        var dist = path.resolve(__dirname, './testResult.json');
        var oldFile = fs.readFileSync(dist, 'utf8');
        var data = JSON.parse(oldFile);
        var imgList = data.imgList;
        if (Array.isArray(imgList)) {
            imgList.push(ctx.request.body);
        }
        else {
            data.imgList = [ctx.request.body];
        }
        fs.writeFileSync(dist, JSON.stringify(data));
        ctx.body = { error: 0, data: {} };
    }
    catch (error) {
        // 如果服务器不存在请求的图片，返回默认数据
        ctx.body = { error: 500, data: {} };
    }
});
router.get('/imgList', function (ctx) {
    try {
        var url = path.resolve(__dirname, './testResult.json');
        var file = fs.readFileSync(url, { encoding: 'utf-8' });
        ctx.body = { error: 0, data: JSON.parse(file) };
    }
    catch (error) {
        // 如果服务器不存在请求的图片，返回默认数据
        ctx.body = { error: 500, data: { reportList: [], imgList: [] } };
    }
});
router.get('/testResult', function (ctx) {
    try {
        var url = path.resolve(__dirname, './testResult.json');
        var file = fs.readFileSync(url, { encoding: 'utf-8' });
        ctx.body = { error: 0, data: JSON.parse(file) };
    }
    catch (error) {
        // 如果服务器不存在请求的图片，返回默认数据
        ctx.body = { error: 500, data: { reportList: [], imgList: [] } };
    }
});
exports.default = router;

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitFile = exports.pushImg = exports.imgList = void 0;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var http = __importStar(require("http"));
exports.imgList = [];
function pushImg(params) {
    exports.imgList.push(params);
    // axios.post('http://localhost:8886/common/imgList', {imgList})
    var req = http.request({
        port: 8886,
        method: 'POST',
        hostname: 'localhost',
        path: '/common/imgList',
        headers: {
            'Content-Type': 'application/json',
        }
    }, function () {
        // console.log('发送成功')
    });
    req.write(JSON.stringify(params));
    req.end();
}
exports.pushImg = pushImg;
function emitFile() {
    try {
        var dist = path.resolve(__dirname, './testResult.json');
        var oldFile = fs.readFileSync(dist, 'utf8');
        var data = JSON.parse(oldFile);
        data.imgList = exports.imgList;
        fs.writeFileSync(dist, JSON.stringify(data));
    }
    catch (error) {
        console.log(error);
    }
}
exports.emitFile = emitFile;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var https = require('https');
var querystring = require('querystring');
var buffer_1 = require("buffer");
var HttpsHelper = function (url, headers, data, method) {
    if (method === void 0) { method = 'GET'; }
    var postData = (method === null || method === void 0 ? void 0 : method.toUpperCase()) === 'POST' ? querystring.stringify(data) : '';
    return new Promise(function (resolve, reject) {
        var client = https.request(url, {
            method: method,
            headers: Object.assign(headers, {
                'Content-Length': postData.length
            })
        }, function (res) {
            var buf = buffer_1.Buffer.from('');
            var r;
            res.on('data', function (d) {
                buf = buffer_1.Buffer.isBuffer(d)
                    ? buffer_1.Buffer.concat([buf, d])
                    : buffer_1.Buffer.concat([buf, buffer_1.Buffer.from(d)]);
            });
            res.on('end', function () {
                try {
                    r = JSON.parse(buf.toString());
                    buf = null;
                    return resolve(r);
                }
                catch (e) {
                    buf = null;
                    r = { code: -1, errmsg: e };
                }
                reject(r);
            });
        });
        client.on('error', function (e) { return reject(e); });
        client.write(postData);
        client.end();
    });
};
exports.default = HttpsHelper;

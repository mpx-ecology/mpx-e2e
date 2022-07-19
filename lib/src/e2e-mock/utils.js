"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDashJoin = exports.toCamelCase = exports.urlWithoutQuery = void 0;
var urlWithoutQuery = function (url) { return url.slice(0, url.indexOf('?')); };
exports.urlWithoutQuery = urlWithoutQuery;
var toCamelCase = function (str) {
    return str.replace(/[/-]([a-z])/g, function (w, g1) { return g1.toUpperCase(); });
};
exports.toCamelCase = toCamelCase;
var toDashJoin = function (url) { return url.replace(/\//g, '-'); };
exports.toDashJoin = toDashJoin;

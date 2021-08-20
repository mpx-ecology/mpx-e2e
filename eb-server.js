#!/usr/bin/env node
// 调试 mock server 打包用的
let esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['./src/e2e-mock/mock.ts'],
  platform: 'node',
  target: 'es6',
  bundle: true,
  outfile: './lib/e2e-mock-server.js',
  // minify: true
  // sourcemap: true,
}).then(() => {
  console.log('打包完成!')
}).catch(() => process.exit(1))

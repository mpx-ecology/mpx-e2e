#!/usr/bin/env node
let esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['./src/e2e-expand.ts'],
  platform: 'node',
  target: 'es2015',
  bundle: true,
  outfile: './lib/e2ex.js',
  minify: true
  // sourcemap: true,
}).then(() => {
  console.log('打包完成!')
}).catch(() => process.exit(1))

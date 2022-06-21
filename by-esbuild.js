#!/usr/bin/env node
let esbuild = require('esbuild');

esbuild.build({
  // entryPoints: ['./src/index.ts'],
  entryPoints: {
    'e2ex': './src/index.ts',
    'plugin-report': './report-server/server.ts'
  },
  platform: 'node',
  target: 'es2015',
  bundle: true,
  // outfile: './lib/e2ex.js',
  outdir: './lib',
  minify: true,
  // sourcemap: true,
}).then(() => {
  console.log('打包完成!')
}).catch(() => process.exit(1))

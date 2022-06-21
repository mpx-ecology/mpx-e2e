#!/usr/bin/env node
let esbuild = require('esbuild');
let program = require('commander');

program.option('-w, --watch', 'watch mode').parse(process.argv)

const watchOnRebuild = {
  onRebuild(error, result) {
  if (error) console.error('watch build failed:', error)
  else console.log('watch build succeeded:', result)
}
}

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
  minify: !program.watch,
  watch: program.watch && watchOnRebuild
  // sourcemap: true,
}).then(() => {
  console.log('打包完成！')
}).catch(() => process.exit(1))

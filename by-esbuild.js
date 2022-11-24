#!/usr/bin/env node
const esbuild = require('esbuild');
const program = require('commander');
const nativeModulePlugin = require('./node-native-plugin');
const { copy } = require('esbuild-plugin-copy');
let pm2;
let pm2ConnectFn;
let pm2ServerCfg;
let pm2ServerName = 'e2ePlatformServer';

program
  .option('-w, --watch', 'watch mode')
  .option('-s, --start', 'start server')
  .parse(process.argv)

if (program.start) {
  pm2 = require('pm2');
  pm2ConnectFn = () => new Promise((resolve, reject) => {
    pm2.connect((err) => {
      if (err) {
        console.error(err);
        pm2.disconnect()
        return reject(err)
      }
      resolve('ok')
    })
  });
  pm2ServerCfg = {
    script: '/Users/didi/Documents/01dev/kf-mp-apphome/node_modules/@mpxjs/e2e/serverTest.js',
    name: pm2ServerName
  }
}

const watchOnRebuild = {
  onRebuild (error, result) {
    if (error) {
      console.error('watch build failed:', error)
    } else {
      console.log('watch build succeeded:', new Date().toLocaleTimeString())
      if (program.start) {
        pm2ConnectFn().then(() => pm2.restart(pm2ServerName, (e) => {
          if (e) {
            console.log('服务重启失败：', e)
            return pm2.disconnect()
          }
          console.log(pm2ServerName, '重启成功！')
        }))
      }
    }
  }
}

esbuild.build({
  // entryPoints: ['./src/index.ts'],
  entryPoints: {
    'e2ex': './src/index.ts',
    'plugin-report': './report-server/server.js'
  },
  platform: 'node',
  target: 'es2020',
  bundle: true,
  // outfile: './lib/e2ex.js',
  outdir: './lib',
  minify: !program.watch,
  watch: program.watch && watchOnRebuild,
  plugins: [
    nativeModulePlugin,
    copy({
      resolveFrom: 'out',
      assets: {
        from: ['./report-server/gen-spec/tpl/**/*'],
        to: ['.']
      },
      keepStructure: true
    })
  ]
}).then(() => {
  console.log('打包完成！');
  console.log(program.watch, program.start)
  if (program.watch) console.log('Watching.....', new Date().toLocaleTimeString());
  if (program.start) {
    console.log('正在启动服务.....')
    pm2ConnectFn().then(() => {
      pm2.start(pm2ServerCfg, (e) => {
        if (e) {
          console.log('服务启动失败：', e)
          return pm2.disconnect()
        }
        console.log(pm2ServerName, '启动成！')
      })
    })
  }
}).catch(() => process.exit(1))

if (program.start) {
  process.on('exit', () => {
    pm2.stop(pm2ServerName, () => {
      pm2.disconnect()
    })
  })
}

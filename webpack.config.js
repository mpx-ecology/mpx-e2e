const path = require('path');
module.exports = {
  target: 'node',
  mode: "production",
  entry: './src/e2e-expand.ts',
  output: {
    filename: 'e2ex.js',
    path: path.resolve(__dirname, 'lib'),
    libraryTarget: 'commonjs'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader']
      }
    ]
  }
}

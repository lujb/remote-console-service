var path = require('path')
var UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  context: __dirname,
  entry: [/*'./math-patch',*/ 'babel-polyfill', './src/server/main'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'remote-console-service.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname),
          path.resolve(__dirname, 'src')
        ],
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ],
        loader: 'babel-loader',
        query: {
          presets: ['env', 'react', 'flow'],
          plugins: [
            'transform-object-rest-spread',
            'transform-async-generator-functions',
            'transform-class-properties',
            'transform-do-expressions',
            'transform-function-bind',
            'transform-decorators-legacy'
          ]
        }
      },
      {
        test: /\.ejs$/,
        loader: 'ejs-loader'
      }
    ]
  },
  target: 'node',
  node: {
    __dirname: true,
    __filename: true
  },
  plugins: [
    new UglifyJSPlugin({
      comments: false
    })
  ]
}

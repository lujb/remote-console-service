var path = require('path')
var UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  context: __dirname,
  entry:  ['./src/remote-console/main'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'remote-console.js'
  },
  // devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src')
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
      }
    ]
  },
  plugins: [
    new UglifyJSPlugin({
      comments: false,
      sourceMap: false
    })
  ]
}

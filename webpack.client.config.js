var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
var UglifyJSPlugin = require('uglifyjs-webpack-plugin')

var packinfo = require('./package.json')

module.exports = {
  context: __dirname,
  entry: ['./src/client/main'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'client.bundle.js'
  },
  // devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src/client')
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
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      },
      {
        test: /\.ejs$/,
        loader: 'ejs-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Remote Console',
      version: packinfo.version,
      author: packinfo.author,
      description: packinfo.description,
      template: 'src/client/index.template.ejs',
      filename: 'out.html',
      // inlineSource: '.(js|css)$'
    }),
    // new HtmlWebpackInlineSourcePlugin(),
    new UglifyJSPlugin({
      comments: false,
      sourceMap: false
    })
  ]
}

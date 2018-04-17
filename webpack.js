const WebpackMd5Hash = require('webpack-md5-hash')
const webpack = require('webpack')
const path = require('path')

const rootPath = path.resolve(__dirname, '.')

module.exports = {
  entry: './index.js',

  output: {
    path: `${rootPath}/public/assets`,
    publicPath: `/public/assets`,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[id]-[chunkhash].js'
  },

  resolve: {
    extensions: ['.js'],
    modules: [ rootPath ]
  },

  plugins: [
    new WebpackMd5Hash()
  ]
}

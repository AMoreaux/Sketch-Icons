'use strict'

const CopyWebpackPlugin = require('copy-webpack-plugin')
const { skpm } = require('./package.json')
const path = require('path')

const pluginResourcesPath = `${skpm.main}/Contents/Resources`

const webpackConfig = {
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve('./resources'),
        to: path.resolve(pluginResourcesPath)
      }
    ])
  ]
}

module.exports = function (config, isPluginCommand) {
  if (isPluginCommand) {
    Object.assign(config, webpackConfig)
  }
}
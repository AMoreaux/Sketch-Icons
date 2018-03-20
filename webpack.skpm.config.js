'use strict'

const CopyWebpackPlugin = require('copy-webpack-plugin')
const merge = require('lodash.merge')
const { skpm } = require('./package.json')
const path = require('path')

const pluginResourcesPath = `${skpm.main}/Contents/Resources`
const pluginSketchPath = `${skpm.main}/Contents/Sketch`

const ressourcesConfig = {
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve('./resources/webview/webview.html'),
        to: path.resolve(pluginResourcesPath)
      },
      {
        from: path.resolve('./resources/SketchIconsFramework.framework'),
        to: path.resolve(`${pluginSketchPath}/SketchIconsFramework.framework/[name].[ext]`)
      },
      {
        from: path.resolve('./resources/icons'),
        to: path.resolve(`${pluginResourcesPath}/icons`)
      }
    ])
  ]
}



module.exports = function (config, isPluginCommand) {
  config.resolve.extensions = ['.js', '.jsx']

  if (isPluginCommand) {
    merge(config, ressourcesConfig)
  }
}

'use strict'

const CopyWebpackPlugin = require('copy-webpack-plugin')
const merge = require('lodash.merge')
const { skpm } = require('./package.json')
const path = require('path')

const pluginResourcesPath = `${skpm.main}/Contents/Resources`

const ressourcesConfig = {
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve('./resources/webview/webview.html'),
        to: path.resolve(pluginResourcesPath)
      }
    ])
  ]
}

// const preactConfig = {
//   // resolve: {
//   //   alias: {
//   //     'react': 'preact-compat',
//   //     'react-dom': 'preact-compat',
//   //     // Not necessary unless you consume a module using `createClass`
//   //     'create-react-class': 'preact-compat/lib/create-react-class'
//   //   }
//   // },
//   plugins: [
//     new CopyWebpackPlugin([
//       {
//         from: path.resolve('./src/assets/colorPicker/webview.html'),
//         to: path.resolve(pluginResourcesPath)
//       }
//     ])
//   ]
// }

module.exports = function (config, isPluginCommand) {
  config.resolve.extensions = ['.js', '.jsx']

  // config.entry = {
  //   'Sketch Icons.sketchplugin/Contents/Sketch/commands' :'./src/commands.js',
  //   'Sketch Icons.sketchplugin/Contents/Resources/webview' :'./src/assets/colorPicker/main.js'
  // }
  //
  // config.output = {
  //   path: __dirname,
  //   filename: '[name].js',
  //   library: 'exports'
  // }
  //
  //
  if (isPluginCommand) {
    merge(config, ressourcesConfig)
  }
}
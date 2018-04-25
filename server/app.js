const WebsocketManager = require('./WebSocketService')
const express = require('express')
const debug = require('debug')('app:server')
const history = require('connect-history-api-fallback')

const helpers = require('../config/helpers')
const config = require('../config/project.config')
const {__DEV__, __PROD__, __TEST__} = config.globals

const app = express()
const api = require('./api')
const ws = new WebsocketManager()

app.use(history())
app.use(function (req, res, next) {
  console.log(req.path)
  next()
})
app.use(function insertCSPHeader(req, res, next) {
  res.setHeader('Content-Security-Policy', 'font-src \'self\' data:;')
  return next()
})
app.use('/api', api)

if (__DEV__) {
  debug('Enabling webpack dev and HMR middleware')

  const Webpack = require('webpack')
  const webpackConfig = require('../webpack.config')
  const compiler = Webpack(webpackConfig)

  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: helpers('src'),
    hot: true,
    inline: true,
    quiet: false,
    noInfo: false,
    lazy: false,
    stats: {
      chunks: false,
      chunkModules: false,
      colors: true
    }
  }))

  app.use(require('webpack-hot-middleware')(compiler, {
    path: '/__webpack_hmr'
  }))

  app.use(express.static(helpers('public')))
  app.use(express.static(compiler.outputPath))
} else if (__PROD__) {
  debug('Prod environment server running.')
  app.use(express.static(config.outDir, {maxAge: '365d'}))
} else if (__TEST__) {
  debug('The test environment is under development.')
}

module.exports = app

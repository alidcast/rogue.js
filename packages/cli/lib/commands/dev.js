process.env.NODE_ENV = 'development'

const http = require('http')
const path = require('path')
const bundle = require('../bundle')
const logger = require('../logger')
const { getApp } = require('../utils')

const PORT = process.env.PORT || 3000

let server = null
let app = null

function serveApp () {
  logger.updateSpinner('[Rogue] Starting server...')

  app = getApp()
  server = http.createServer(app.render)

  server.listen(PORT, error => {
    if (error){
      logger.error(error)
    } else {
      logger.persistSpinner(logger.emoji.success, `[Rogue] Server listening on port ${PORT}.`, 'green')
    }
  })
}

function restartApp () {
  server.removeListener('request', app.render)
  app = getApp()
  server.on('request', app.render)
}

bundle({
  onStart() {
    if (server) logger.persistSpinner(logger.emoji.info, `===== Rebuilding changes =====`, 'blue')
  },

  onClientBundled () {
    logger.persistSpinner(logger.emoji.success, `Client bundled successfully.`, 'blue')
  },

  onServerBundled () {
    logger.persistSpinner(logger.emoji.success, `Server bundled successfully.`, 'cyan')
    if (server) restartApp()
  },

  onBundled() {
    if (server) logger.persistSpinner(logger.emoji.success, `==== Build complete ====`, 'green')
  }
})
  .then(() => {
    logger.persistSpinner(logger.emoji.success, `Build finished, watching for changes...`, 'cyan')
    try {
      serveApp()
    } catch (err) {
      logger.error(err)
    }
  })
  .catch(err => {
    logger.error(err)
  })
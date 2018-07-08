process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

const http = require('http')
const { createBundlers, bundleApp } = require('../bundle')
const { requireUncached } = require('../bundle/utils')
const { BUILD_PATH, BUILD_PUBLIC_DIR } = require('../bundle/constants')

const PORT = process.env.PORT || 3000

let server = null
let currentApp = null

const getApp = () => requireUncached(BUILD_PATH).default

createBundlers().then(({ clientBundler, serverBundler }) => {
  const serveApp = () => {
    const app = currentApp = getApp()

    server = http.createServer(app.render)

    server.listen(PORT, error => {
      if (error) console.log(error)
    })
  }

  const restartApp = () => {
    const app = currentApp = getApp()
    server.removeListener('request', currentApp.render)
    server.on('request', app.render)
  }

  // Watch mode is disabled for client so we handle rebundling it ourselves 
  // when server bundle changes; and restart server when client bundle finishes
  serverBundler.on('bundled', async () => {
    if (currentApp !== null) {
      await clientBundler.bundle()
      restartApp()
    }
  })

  bundleApp(clientBundler, serverBundler).then(() => {
    console.log('Compiled succesfully! Starting App...')
    serveApp()
  })
})

process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

const http = require('http')
const { rmdir } = require('fs')
const { requireUncached } = require('../src/bundler/utils')

const bundler = require('../src/bundler/index')
const { bundleApp } = require('./common')

const {  
  SERVER,
  CLIENT,
  BUILD_PATH
} = require('../src/bundler/constants')

const port = process.env.PORT || 3000

let server 
let currentApp = null
const serverBundler = bundler(SERVER)
const clientBundler = bundler(CLIENT)

const getApp = () => requireUncached(BUILD_PATH).default

const serveApp = () => {
  const app = currentApp = getApp()
  server = http.createServer(app)
  server.listen(port, error => {
    if (error) console.log(error)
    console.log(`🚀 Development server started in port ${port}`)
  })
}

const restartApp = async () => {
  if (!currentApp) return // initial bundle

  // Watch mode is disabled for client so we handle rebundling it ourselves
  console.log('Rebuilding client...')
  await clientBundler.bundle()

  console.log('🔁  HMR Reloading server...')
  server.removeListener('request', currentApp)
  const newApp = currentApp = getApp()
  server.on('request', newApp)
}

serverBundler.on('bundled', restartApp)
bundleApp(clientBundler, serverBundler).then(() => {
  console.log('Starting App...')
  serveApp()
})

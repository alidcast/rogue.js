process.env.NODE_ENV = 'development'

const http = require('http')
const bundler = require('../src/bundler/index')
const { rmdir } = require('fs')
const {
  requireUncached
} = require('../src/bundler/utils')

const {  
  SERVER,
  CLIENT,
  TMP_DIR,
  BUILD_DIR,
  CACHE_DIR,
  BUILD_PATH
} = require('../src/bundler/constants')

const port = process.env.PORT || 3000

let server 
let currentApp = null
const serverBundler = bundler(SERVER)
const clientBundler = bundler(CLIENT)

const getApp = () => requireUncached(BUILD_PATH).default

const bundleApp = async () => {
  try {
    // we run the bundles one at a time to avoid compilation problems with Parcel
    await clientBundler.bundle()
    await serverBundler.bundle()
    console.log('Bundling success! Starting App...')
  } catch (err) {
    if (err && err.message) console.log(err.message)
    process.exit(1)
  }
}

const serveApp = () => {
  const app = currentApp = getApp()
  server = http.createServer(app)
  server.listen(port, error => {
    if (error) console.log(error)
    console.log(`🚀 Development server started in port ${port}`)
  })
}

const restartApp = () => {
  if (!currentApp) return
  console.log('🔁  HMR Reloading server...')
  server.removeListener('request', currentApp)
  const newApp = currentApp = getApp()
  server.on('request', newApp)
}

serverBundler.on('buildEnd', restartApp)
bundleApp().then(serveApp)

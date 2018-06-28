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

const getApp = () => requireUncached(BUILD_PATH).default

const serverBundler = bundler(SERVER)
const clientBundler = bundler(CLIENT)

let server 
let currentApp = null

serverBundler.on('buildEnd', () => {
  if (!currentApp) return
  console.log('🔁  HMR Reloading server...')
  server.removeListener('request', currentApp)
  const newApp = currentApp = getApp()
  server.on('request', newApp)
})

const bundles = runBundles([serverBundler, clientBundler])

bundles.then(() => {
  console.log('Bundling success! Starting App...')
  const app = currentApp = getApp()

  server = http.createServer(app)

  server.listen(port, error => {
    if (error) console.log(error)

    console.log(`🚀 Development server started in port ${port}`)
  })
})
.catch(err => {
  if (err && err.message) console.log(err.message)
  process.exit(1)
  if (existsSync(BUILD_DIR)) rmdir(BUILD_DIR)
  if (existsSync(CACHE_DIR)) rmdir(TMP_DIR)
  if (existsSync(TMP_DIR)) rmdir(TMP_DIR)
})

function runBundles(bundlers) {
  let bundlePromises = []
  bundlers.forEach(bundler => {
    bundlePromises.push(
      bundler.bundle()
        .catch(err => {
          console.log(err)
          process.exit(1)
          if (existsSync(BUILD_DIR)) rmdir(BUILD_DIR)
          if (existsSync(CACHE_DIR)) rmdir(TMP_DIR)
          if (existsSync(TMP_DIR)) rmdir(TMP_DIR)
        })
    )
  })
  return Promise.all(bundlePromises)
}



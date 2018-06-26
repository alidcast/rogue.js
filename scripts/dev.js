process.env.NODE_ENV = 'development'

const http = require('http')
const bundler = require('../src/bundler/index')

const {
  requireUncached
} = require('../src/bundler/utils')

const {  
  SERVER,
  CLIENT,
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

const bundles = Promise.all([serverBundler.bundle(), clientBundler.bundle()])

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
})


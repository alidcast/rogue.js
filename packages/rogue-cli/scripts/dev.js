process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

const http = require('http')
const { createBundlers, bundleApp } = require('../src/bundle')
const { requireUncached } = require('../src/bundle/utils')
const { BUILD_PATH, BUILD_PUBLIC_DIR } = require('../src/bundle/constants')

const PORT = process.env.PORT || 3000

let server = null
let currentApp = null

const getApp = () => requireUncached(BUILD_PATH).default

createBundlers().then(({ clientBundler, serverBundler }) => {
  const serveApp = () => {
    const app = currentApp = getApp()

    app.instance.use(function (req, res, next) {
      console.log('here...?')
      console.log(clientBundler.pending)
      if (clientBundler.pending) this.clientBundler.once('bundled', next)
      else next()
    })

    app.setupMiddleware()
    server = http.createServer(app.instance)

    server.listen(PORT, error => {
      if (error) console.log(error)
    })
  }

  const restartApp = () => {
    console.log('closing this jawn')
    server.close()
    const app = currentApp = getApp()

    app.instance.use(function (req, res, next) {
      console.log('here...?')
      console.log(clientBundler.pending)
      if (clientBundler.pending) this.clientBundler.once('bundled', next)
      else next()
    })
    
    app.setupMiddleware()
    
    console.log('opening this one....')
    server = http.createServer(app.instance)
    server.listen(PORT, error => {
      if (error) console.log(error)
    })

    // server.removeListener('request', currentApp.instance)

    // app.instance.use(function (req, res, next) {
    //   console.log('pending.....?')
    //   console.log(clientBundler.pending)
    //   if (clientBundler.pending) this.clientBundler.once('bundled', next)
    //   else next()
    // })
    // app.setupMiddleware()
    // server.on('request', app.instance)
  }

  // Watch mode is disabled for client so we handle rebundling it ourselves 
  // when server bundle changes; and restart server when client bundle finishes
  serverBundler.on('bundled', async () => {
    if (currentApp !== null) {
      console.log('bundling client...!')
      // await clientBundler.bundle()
      console.log('dpne wit client')
      restartApp()
    }
  })
  // clientBundler.on('bundled', () => {
  //   console.log('🔁  HMR Reloading server...')
  //   if (currentApp !== null) restartApp()
  // })
  // console.log(clientBundler)
  console.log(clientBundler.mainBundler)
  bundleApp(clientBundler, serverBundler).then(() => {
    console.log('Compiled succesfully! Starting App...')
    serveApp()
  })
})

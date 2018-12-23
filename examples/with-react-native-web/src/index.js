import http from 'http'
import app from './server'

const server = http.createServer(app.render)

let currentApp = app

server.listen(process.env.PORT || 3000, error => {
  if (error) console.log(error)
  console.log('🚀 started')
})

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!')

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading server...')
    const newApp = require('./server').default 
    server.removeListener('request', currentApp)
    server.on('request', newApp.render)
    currentApp = newApp
  })
}